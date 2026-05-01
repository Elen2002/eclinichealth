import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const AdminChatManager = ({ locale = 'en' }) => {
    const t = {
        en: {
            activeSessions: 'Active Sessions',
            searchUser: 'Search user...',
            noMatches: 'No matches found',
            noActiveRequests: 'No active support requests',
            chatWith: 'Chat with',
            patientSupport: 'Patient Support',
            support: 'Support',
            typeResponse: 'Type your response...',
            selectConversation: 'Select a conversation to start helping',
            patientInquiries: 'Patient inquiries will appear on the left in real-time.',
        },
        hy: {
            activeSessions: 'Ակտիվ սեսիաներ',
            searchUser: 'Որոնել օգտատիրոջը...',
            noMatches: 'Համընկնումներ չեն գտնվել',
            noActiveRequests: 'Ակտիվ աջակցության հարցումներ չկան',
            chatWith: 'Զրույց',
            patientSupport: 'Պացիենտների աջակցություն',
            support: 'Աջակցություն',
            typeResponse: 'Գրեք ձեր պատասխանը...',
            selectConversation: 'Ընտրեք զրույց՝ օգնություն սկսելու համար',
            patientInquiries: 'Պացիենտների հարցումները կհայտնվեն ձախ կողմում իրական ժամանակում:',
        },
        ru: {
            activeSessions: 'Активные сессии',
            searchUser: 'Поиск пользователя...',
            noMatches: 'Совпадений не найдено',
            noActiveRequests: 'Активных запросов нет',
            chatWith: 'Чат с',
            patientSupport: 'Поддержка пациентов',
            support: 'Поддержка',
            typeResponse: 'Введите ваш ответ...',
            selectConversation: 'Выберите беседу, чтобы начать помощь',
            patientInquiries: 'Запросы пациентов будут появляться слева в реальном времени.',
        }
    };

    const currentT = t[locale] || t.en;

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

    useEffect(() => {
        if (!activeRoom) return;

        // Load history from DB
        fetch(`/api/chat/history/${activeRoom}`)
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(msg => ({
                    sender: msg.sender.roles.includes('ROLE_ADMIN') || msg.sender.roles.includes('ROLE_DOCTOR') ? 'admin' : 'user',
                    text: msg.content,
                    time: msg.createdAt,
                    email: msg.sender.email
                }));
                
                setChats(prev => ({
                    ...prev,
                    [activeRoom]: {
                        ...prev[activeRoom],
                        messages: formatted,
                        lastMessage: formatted[formatted.length - 1]?.text || 'History loaded'
                    }
                }));
            })
            .catch(err => console.error('Failed to load chat history:', err));
    }, [activeRoom]);

    const handleSend = () => {
        if (!inputValue.trim() || !activeRoom) return;

        const newMessage = {
            sender: 'admin',
            text: inputValue,
            time: new Date(),
            roomId: activeRoom
        };

        // Emit via socket
        socket?.emit('chat_message', newMessage);

        // Update local state immediately
        setChats(prev => {
            const currentChat = prev[activeRoom] || { messages: [] };
            return {
                ...prev,
                [activeRoom]: {
                    ...currentChat,
                    messages: [...currentChat.messages, newMessage],
                    lastMessage: inputValue
                }
            };
        });

        // Save to DB
        fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: inputValue,
                roomId: activeRoom,
                targetId: activeRoom.startsWith('pair_') ? activeRoom.split('_')[1] : activeRoom
            })
        }).catch(err => console.error('Failed to save message to DB:', err));

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
                        {currentT.activeSessions}
                    </div>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light" 
                            placeholder={currentT.searchUser}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-auto flex-grow-1">
                    {filteredRooms.length === 0 ? (
                        <div className="p-4 text-center text-muted small italic">
                            {searchTerm ? currentT.noMatches : currentT.noActiveRequests}
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
                                <h6 className="mb-0 fw-bold">{currentT.chatWith} {activeRoom}</h6>
                                <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill">{currentT.patientSupport}</span>
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
                                                {msg.sender === 'admin' ? currentT.support : activeRoom}
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
                                    placeholder={currentT.typeResponse}
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
                        <h5>{currentT.selectConversation}</h5>
                        <p className="small">{currentT.patientInquiries}</p>
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
