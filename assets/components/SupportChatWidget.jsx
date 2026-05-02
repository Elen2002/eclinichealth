import React, { useState, useEffect, useRef } from 'react';
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
    const messagesEndRef = useRef(null);

    const [userId] = useState(() => {
        if (user && user.identifier) return user.identifier;
        return 'Guest_' + Math.random().toString(36).substr(2, 5);
    });

    const currentRoomId = chatTarget ? `pair_${userId}_${chatTarget.id}` : userId;

    useEffect(() => {
        // Simple polling instead of sockets
        const fetchHistory = () => {
            fetch(`/api/chat/history/${currentRoomId}`)
                .then(res => res.json())
                .then(data => {
                    setMessages(data.map(msg => ({
                        id: msg.id,
                        text: msg.content,
                        sender: msg.sender.identifier === userId ? 'user' : 'support',
                        time: msg.createdAt
                    })));
                })
                .catch(err => console.error('Polling failed:', err));
        };

        fetchHistory(); // Initial load
        const interval = setInterval(fetchHistory, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [userId, currentRoomId]);

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

        // Save persistent message in DB
        fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: inputValue,
                roomId: currentRoomId,
                targetId: chatTarget?.id || 'support'
            })
        }).catch(err => console.error('Failed to save message to DB:', err));

        // Save persistent notification in DB if we have a target
        if (chatTarget?.id) {
            fetch('/api/notifications/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetIdentifier: chatTarget.id,
                    title: (user && (user.firstName ? user.firstName + ' ' + user.lastName : user.email)) || 'Guest',
                    message: inputValue.substring(0, 100),
                    type: 'chat',
                    link: '/' + locale + '/profile/chat/' + chatTarget.dbId + (user ? '/' + user.id : '')
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
        <div className="support-chat-wrapper">
            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window shadow-lg">
                    {/* Header */}
                    <div className="chat-header p-3 px-4 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <div className="online-indicator"></div>
                            <span className="fw-bold">
                                {chatTarget ? (locale === 'hy' ? `Կապ բժշկի հետ: ${chatTarget.name}` : `Chat with Dr. ${chatTarget.name}`) : (locale === 'hy' ? 'Աջակցություն' : 'Support Chat')}
                            </span>
                        </div>
                        <button className="btn-close btn-close-white" onClick={() => { setIsOpen(false); setChatTarget(null); }} style={{ fontSize: '0.8rem' }}></button>
                    </div>

                    {/* Messages Area */}
                    <div className="chat-messages p-4 flex-grow-1 overflow-auto">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-3 rounded-4 shadow-sm chat-bubble sender-${msg.sender}`}>
                                    {msg.text}
                                    <div className="chat-time">
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
            >
                <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`}></i>
                {!isOpen && hasUnread && <div className="notification-badge">1</div>}
            </button>

            <style dangerouslySetInnerHTML={{ __html: `
                .support-chat-wrapper {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .chat-window {
                    width: 380px;
                    height: 520px;
                    background: white;
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin-bottom: 20px;
                    border: 1px solid rgba(0,0,0,0.05);
                    animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                }

                .chat-header {
                    background: var(--brand-gradient);
                    color: white;
                }

                .chat-messages {
                    background: #f8fafc;
                }

                .chat-bubble {
                    max-width: 80%;
                    font-size: 0.95rem;
                }

                .chat-bubble.sender-user {
                    background: var(--brand-color);
                    color: #ffffff !important;
                    border-bottom-right-radius: 4px;
                }

                .chat-bubble.sender-user .chat-time {
                    color: rgba(255, 255, 255, 0.8) !important;
                }

                .chat-bubble.sender-support {
                    background: white;
                    color: #1e293b;
                    border-bottom-left-radius: 4px;
                }

                .chat-time {
                    font-size: 0.65rem;
                    opacity: 0.7;
                    text-align: right;
                    margin-top: 4px;
                }

                .chat-toggle-btn {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: var(--brand-color);
                    color: white;
                    border: none;
                    font-size: 1.8rem;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 576px) {
                    .support-chat-wrapper {
                        bottom: 20px;
                        right: 20px;
                    }
                    .chat-window {
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        right: 20px;
                        bottom: 90px;
                        width: auto;
                        height: auto;
                        border-radius: 20px;
                        margin-bottom: 0;
                    }
                    .chat-toggle-btn {
                        width: 56px;
                        height: 56px;
                        font-size: 1.5rem;
                    }
                }

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
