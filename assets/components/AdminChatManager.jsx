import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const AdminChatManager = ({ locale = 'en' }) => {
    const [chats, setChats] = useState({}); // { roomId: { messages: [], lastMessage: '' } }
    const [activeRoom, setActiveRoom] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const socketUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join_support', { isAdmin: true });
        });

        // Listen for all existing active chats on refresh
        newSocket.on('admin_all_active_chats', (activeChats) => {
            const initialChats = {};
            activeChats.forEach(chat => {
                initialChats[chat.roomId] = { messages: [], lastMessage: chat.lastMessage };
            });
            setChats(initialChats);
        });

        newSocket.on('message', (msg) => {
            // Room ID is usually the user's ID or socket ID
            const roomId = msg.roomId || 'global'; 
            setChats(prev => {
                const currentChat = prev[roomId] || { messages: [] };
                return {
                    ...prev,
                    [roomId]: {
                        ...currentChat,
                        messages: [...currentChat.messages, msg],
                        lastMessage: msg.text
                    }
                };
            });
        });

        // Listen for message history
        newSocket.on('chat_history', (data) => {
            setChats(prev => {
                const currentChat = prev[data.roomId] || { messages: [] };
                return {
                    ...prev,
                    [data.roomId]: {
                        ...currentChat,
                        messages: data.messages,
                        lastMessage: data.messages[data.messages.length - 1]?.text || 'History loaded'
                    }
                };
            });
        });

        // Listen for new users connecting
        newSocket.on('admin_user_online', (user) => {
            setChats(prev => {
                if (prev[user.userId]) return prev;
                return {
                    ...prev,
                    [user.userId]: { messages: [], lastMessage: 'New session started' }
                };
            });
        });

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats, activeRoom]);

    useEffect(() => {
        if (activeRoom && socket) {
            socket.emit('join_support', { roomId: activeRoom });
        }
    }, [activeRoom, socket]);

    const handleSend = () => {
        if (!inputValue.trim() || !activeRoom) return;

        const msg = {
            roomId: activeRoom,
            text: inputValue,
            sender: 'admin',
            time: new Date()
        };

        socket.emit('chat_message', msg);
        
        // Add to local state immediately so admin sees their own message
        setChats(prev => {
            const currentChat = prev[activeRoom] || { messages: [] };
            return {
                ...prev,
                [activeRoom]: {
                    ...currentChat,
                    messages: [...currentChat.messages, msg],
                    lastMessage: msg.text
                }
            };
        });
        
        setInputValue('');
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredRooms = Object.keys(chats).filter(roomId => 
        roomId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="d-flex h-100" style={{ background: 'white' }}>
            {/* Sidebar: Active Chats */}
            <div className="border-end d-flex flex-column" style={{ width: '320px', background: '#f8fafc' }}>
                <div className="p-3 border-bottom bg-white">
                    <div className="fw-bold text-uppercase small tracking-wider text-muted mb-3">
                        Active Sessions
                    </div>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light" 
                            placeholder="Search user..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-auto flex-grow-1">
                    {filteredRooms.length === 0 ? (
                        <div className="p-4 text-center text-muted small italic">
                            {searchTerm ? 'No matches found' : 'No active support requests'}
                        </div>
                    ) : (
                        filteredRooms.map(roomId => (
                            <div 
                                key={roomId} 
                                onClick={() => setActiveRoom(roomId)}
                                className={`p-3 border-bottom cursor-pointer transition-all ${activeRoom === roomId ? 'bg-primary-subtle border-start border-4 border-primary' : 'hover-bg-light'}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="fw-bold small">{roomId.startsWith('Guest_') ? 'Guest' : 'User'}: {roomId}</span>
                                </div>
                                <div className="small text-muted text-truncate">{chats[roomId].lastMessage}</div>
                            </div>
                        ))
                    )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow-1 d-flex flex-direction-column" style={{ display: 'flex', flexDirection: 'column' }}>
                    {activeRoom ? (
                        <>
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 fw-bold">Chat with {activeRoom}</h6>
                                <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill">Patient Support</span>
                            </div>
                            
                            <div className="flex-grow-1 p-4 overflow-auto" style={{ background: '#f1f5f9', flexGrow: 1 }}>
                                {chats[activeRoom].messages.map((msg, i) => (
                                    <div key={i} className={`d-flex mb-3 ${msg.sender === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div className={`p-3 rounded-4 shadow-sm`} style={{
                                            maxWidth: '70%',
                                            background: msg.sender === 'admin' ? 'var(--brand-color)' : 'white',
                                            color: msg.sender === 'admin' ? 'white' : '#1e293b',
                                            borderBottomRightRadius: msg.sender === 'admin' ? '4px' : '20px',
                                            borderBottomLeftRadius: msg.sender === 'user' ? '4px' : '20px',
                                        }}>
                                            <div className="small mb-1 fw-bold opacity-75">
                                                {msg.sender === 'admin' ? 'Support' : activeRoom}
                                                {msg.email && <span className="ms-2 fw-normal opacity-50">({msg.email})</span>}
                                            </div>
                                        <div>{msg.text}</div>
                                        <div className="text-end mt-1" style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                                            {new Date(msg.time).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 bg-white border-top">
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control border-0 bg-light rounded-pill px-4" 
                                    placeholder="Type your response..." 
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                                />
                                <button 
                                    className="btn btn-primary rounded-circle ms-2" 
                                    onClick={handleSend}
                                    style={{ width: '45px', height: '45px', background: 'var(--brand-color)', border: 'none' }}
                                >
                                    <i className="bi bi-send-fill"></i>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted p-5 text-center">
                        <i className="bi bi-chat-left-dots display-1 opacity-25 mb-4"></i>
                        <h5>Select a conversation to start helping</h5>
                        <p className="small">Patient inquiries will appear on the left in real-time.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .cursor-pointer { cursor: pointer; }
                .hover-bg-light:hover { background: #f1f5f9; }
                .bg-primary-subtle { background: rgba(99, 102, 241, 0.1) !important; }
            `}</style>
        </div>
    );
};

export default AdminChatManager;
