import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { t } from '../utils/translations.js';

const SupportChatWidget = ({ locale = 'en', user = null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatTarget, setChatTarget] = useState(null); // { id, name }

    const [hasUnread, setHasUnread] = useState(() => {
        return sessionStorage.getItem('chat_has_unread') !== 'false';
    });

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            sessionStorage.setItem('chat_has_unread', 'false');
        }
    }, [isOpen]);

    useEffect(() => {
        // Expose a global function to open chat with a specific doctor
        window.openDoctorChat = (doctorId, doctorName) => {
            setChatTarget({ id: doctorId, name: doctorName });
            setIsOpen(true);
        };
    }, []);

    const [messages, setMessages] = useState([
        { id: '1', text: locale === 'hy' ? 'Ողջույն! Ինչպե՞ս կարող ենք օգնել Ձեզ:' : 'Hello! How can we help you today?', sender: 'support', time: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const [userId] = useState(() => {
        if (user && user.identifier) return user.identifier;
        return 'Guest_' + Math.random().toString(36).substr(2, 5);
    });

    // Compute room ID: if chatting with a doctor, use a pair-specific room
    const currentRoomId = chatTarget ? `pair_${userId}_${chatTarget.id}` : userId;

    useEffect(() => {
        // Initialize socket connection to port 3001
        const socketUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
        const newSocket = io(socketUrl, {
            transports: ['websocket']
        });
        setSocket(newSocket);

        // Join appropriate room
        newSocket.on('connect', () => {
            console.log('Connected to socket server, joining room:', currentRoomId);
            newSocket.emit('join_support', { userId: userId, roomId: currentRoomId });
        });

        newSocket.on('chat_history', (data) => {
            if (data.roomId === currentRoomId) {
                setMessages(data.messages);
            }
        });

        newSocket.on('message', (msg) => {
            if (msg.roomId === currentRoomId) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: msg.text,
                    sender: msg.sender || 'support',
                    time: new Date()
                }]);
            }
        });

        return () => newSocket.close();
    }, [userId, currentRoomId]); // Reconnect/Re-join when room changes

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            time: new Date(),
            roomId: currentRoomId
        };

        setMessages(prev => [...prev, newMessage]);
        socket?.emit('chat_message', { 
            text: inputValue,
            sender: 'user',
            roomId: currentRoomId,
            targetId: chatTarget?.id || 'support',
            email: user?.email || null
        });

        // Save persistent notification in DB if we have a target
        if (chatTarget?.id) {
            fetch('/api/notifications/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetIdentifier: chatTarget.id, // This was passed as the name/identifier in openDoctorChat
                    title: 'New Message',
                    message: inputValue.substring(0, 100),
                    type: 'chat',
                    link: '/' + locale + '/profile/chat/' + chatTarget.dbId // We should make sure we have the DB ID
                })
            }).catch(err => console.error('Failed to save notification:', err));
        }

        setInputValue('');

        // Mock auto-reply if no backend socket is responding
        setTimeout(() => {
            if (messages.length < 3) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: locale === 'hy' ? 'Շնորհակալություն: Մեր մասնագետը շուտով կմիանա զրույցին:' : 'Thank you. Our specialist will join the chat shortly.',
                    sender: 'support',
                    time: new Date()
                }]);
            }
        }, 1500);
    };

    return (
        <div className="support-chat-wrapper" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 10000 }}>
            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window shadow-lg" style={{
                    width: '380px',
                    height: '520px',
                    background: 'white',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    {/* Header */}
                    <div className="chat-header p-3 px-4 d-flex align-items-center justify-content-between" style={{ background: 'var(--brand-gradient)', color: 'white' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="online-indicator"></div>
                            <span className="fw-bold">
                                {chatTarget ? (locale === 'hy' ? `Կապ բժշկի հետ: ${chatTarget.name}` : `Chat with Dr. ${chatTarget.name}`) : (locale === 'hy' ? 'Աջակցություն' : 'Support Chat')}
                            </span>
                        </div>
                        <button className="btn-close btn-close-white" onClick={() => { setIsOpen(false); setChatTarget(null); }} style={{ fontSize: '0.8rem' }}></button>
                    </div>

                    {/* Messages Area */}
                    <div className="chat-messages p-4 flex-grow-1 overflow-auto" style={{ background: '#f8fafc' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-3 rounded-4 shadow-sm`} style={{
                                    maxWidth: '80%',
                                    background: msg.sender === 'user' ? 'var(--brand-color)' : 'white',
                                    color: msg.sender === 'user' ? 'white' : '#1e293b',
                                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                                    borderBottomLeftRadius: msg.sender === 'support' ? '4px' : '18px',
                                    fontSize: '0.95rem'
                                }}>
                                    {msg.text}
                                    <div style={{ fontSize: '0.65rem', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>
                                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="chat-input-area p-3 bg-white border-top">
                        <div className="input-group gap-2">
                            <input
                                type="text"
                                className="form-control border-0 bg-light rounded-pill px-4"
                                placeholder={locale === 'hy' ? 'Գրեք այստեղ...' : 'Type a message...'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                style={{ height: '44px' }}
                            />
                            <button
                                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                                onClick={handleSend}
                                style={{ width: '44px', height: '44px', background: 'var(--brand-color)', border: 'none' }}
                            >
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button (FAB) */}
            <button
                className={`chat-toggle-btn shadow-lg d-flex align-items-center justify-content-center ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--brand-color)',
                    color: 'white',
                    border: 'none',
                    fontSize: '1.8rem',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    position: 'relative'
                }}
            >
                <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`}></i>
                {!isOpen && hasUnread && <div className="notification-badge">1</div>}
            </button>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .chat-toggle-btn:hover {
                    transform: scale(1.1) rotate(5deg);
                }
                
                .chat-toggle-btn.active {
                    transform: rotate(90deg);
                    background: #64748b;
                }
                
                .online-indicator {
                    width: 10px;
                    height: 10px;
                    background: #10b981;
                    border-radius: 50%;
                    border: 2px solid white;
                }
                
                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ef4444;
                    color: white;
                    font-size: 0.75rem;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    border: 2px solid white;
                }

                .chat-messages::-webkit-scrollbar {
                    width: 4px;
                }
                .chat-messages::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
            ` }} />
        </div>
    );
};

export default SupportChatWidget;
