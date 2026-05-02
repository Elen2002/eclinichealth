import React, { useState, useEffect, useRef } from 'react';

const AdminChatManager = ({ user, locale = 'en' }) => {
    const appData = window.APP_DATA || {};
    const currentUser = user || appData.user;
    const [chats, setChats] = useState({});
    const [activeRoom, setActiveRoom] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);
    const messagesEndRef = useRef(null);

    const translations = {
        en: {
            activeSessions: "Active Sessions",
            searchUser: "Search users...",
            noMatches: "No matches found",
            noActiveRequests: "No active support requests",
            chatWith: "Chat with",
            patientSupport: "Patient Support",
            support: "Support",
            typeResponse: "Type your response...",
            selectConversation: "Select a conversation to start helping",
            patientInquiries: "Patient inquiries will appear on the left in real-time.",
            showAll: "Show All Chats"
        },
        hy: {
            activeSessions: "ԱԿՏԻՎ ՍԵՍԻԱՆԵՐ",
            searchUser: "Որոնել օգտատիրոջը...",
            noMatches: "Համընկնումներ չեն գտնվել",
            noActiveRequests: "Ակտիվ աջակցության հարցումներ չկան",
            chatWith: "Զրույց",
            patientSupport: "Պացիենտների աջակցություն",
            support: "Աջակցություն",
            typeResponse: "Գրեք ձեր պատասխանը...",
            selectConversation: "Ընտրեք զրույց՝ օգնություն սկսելու համար",
            patientInquiries: "Պացիենտների հարցումները կհայտնվեն ձախ կողմում իրական ժամանակում:",
            showAll: "Ցույց տալ բոլորը"
        }
    };

    const currentT = translations[locale] || translations.en;

    // Polling for active sessions
    useEffect(() => {
        const fetchSessions = () => {
            fetch('/api/admin/chat/sessions') 
                .then(res => res.json())
                .then(data => {
                    setChats(prev => {
                        const next = { ...prev };
                        data.forEach(session => {
                            if (!next[session.roomId]) {
                                next[session.roomId] = { messages: [], lastMessage: session.lastMessage };
                            } else {
                                next[session.roomId].lastMessage = session.lastMessage;
                            }
                        });
                        return next;
                    });
                })
                .catch(err => console.error('Failed to load sessions:', err));
        };

        fetchSessions();
        const interval = setInterval(fetchSessions, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch messages for active room
    useEffect(() => {
        if (!activeRoom || activeRoom === 'System Check' || activeRoom === 'Debug') return;

        const fetchHistory = () => {
            fetch(`/api/chat/history/${activeRoom}`)
                .then(res => res.json())
                .then(data => {
                    const formatted = data.map(msg => {
                        // Direct access to global data for maximum reliability
                        const globalUser = window.APP_DATA?.user;
                        const currentAdmin = user || globalUser;
                        
                        // Exhaustive check for sender identity
                        const senderEmail = (typeof msg.sender === 'string') ? msg.sender : 
                                           (msg.sender?.email || msg.sender?.identifier || msg.sender?.username || msg.sender?.user_identifier);
                        const senderId = msg.sender?.id;
                        
                        // Exhaustive check for our own identity
                        const myIdentities = [
                            currentAdmin?.email,
                            currentAdmin?.identifier,
                            currentAdmin?.username,
                            currentAdmin?.user_identifier,
                            currentAdmin?.id
                        ].filter(Boolean).map(v => String(v).toLowerCase());
                        
                        const isFromMe = myIdentities.some(id => 
                            (senderEmail && id === String(senderEmail).toLowerCase()) ||
                            (senderId && id === String(senderId))
                        );
                        
                        const roles = msg.sender?.roles || [];
                        const hasAdminRole = Array.isArray(roles) && (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER_ADMIN'));
                        
                        return {
                            sender: (isFromMe || hasAdminRole) ? 'admin' : 'user',
                            text: msg.content,
                            time: msg.createdAt,
                            email: senderEmail || 'Guest'
                        };
                    });

                    setChats(prev => ({
                        ...prev,
                        [activeRoom]: {
                            ...prev[activeRoom],
                            messages: formatted
                        }
                    }));
                })
                .catch(err => console.error('Failed to load history:', err));
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 4000);
        return () => clearInterval(interval);
    }, [activeRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats[activeRoom]?.messages]);

    const handleSend = () => {
        if (!inputValue.trim() || !activeRoom) return;

        let targetId = activeRoom.startsWith('pair_') ? activeRoom.split('_')[1] : activeRoom;
        
        // If room is like "Doctor (email@mail.ru)", extract the email prefix
        if (targetId.includes('(') && targetId.includes(')')) {
            const match = targetId.match(/\((.*?)\)/);
            if (match && match[1]) {
                targetId = match[1].split('@')[0];
                targetId = targetId.charAt(0).toUpperCase() + targetId.slice(1);
            }
        }

        const payload = {
            text: inputValue,
            targetId: targetId,
            roomId: activeRoom
        };

        fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(async response => {
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Invalid JSON:', text);
                alert('Server Error (HTML): ' + text.substring(0, 200));
                return { success: false, error: 'Invalid server response' };
            }
        })
        .then(data => {
            if (data.success) {
                setInputValue('');
                // Optimistic update
                setChats(prev => {
                    const room = prev[activeRoom] || { messages: [] };
                    return {
                        ...prev,
                        [activeRoom]: {
                            ...room,
                            messages: [...room.messages, {
                                sender: 'admin',
                                text: payload.text,
                                time: new Date().toISOString()
                            }]
                        }
                    };
                });
            } else {
                 alert('Error: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(err => {
            console.error('Chat Network Error:', err);
            alert('Network error while sending message.');
        });
    };

    const filteredRooms = Object.keys(chats).filter(roomId => {
        const matchesSearch = roomId.toLowerCase().includes(searchTerm.toLowerCase());
        if (showAll) return matchesSearch;
        return matchesSearch && !roomId.startsWith('pair_');
    }).sort((a, b) => {
        // Sort by presence of messages first
        return (chats[b].messages?.length || 0) - (chats[a].messages?.length || 0);
    });

    return (
        <div className="d-flex h-100 bg-white shadow-sm rounded-4 overflow-hidden" style={{ minHeight: '700px' }}>
            {/* Sidebar */}
            <div className="border-end d-flex flex-column" style={{ width: '320px', background: '#f8fafc' }}>
                <div className="p-4 border-bottom bg-white">
                    <div className="fw-bold text-uppercase small tracking-wider text-primary mb-3">
                        {currentT.activeSessions}
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-0">
                        <div className="input-group input-group-sm shadow-sm rounded-pill overflow-hidden bg-white border flex-grow-1">
                            <span className="input-group-text bg-white border-0 ps-3">
                                <i className="bi bi-search text-primary opacity-75"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-0 ps-0 shadow-none bg-white" 
                                placeholder={currentT.searchUser} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="form-check form-switch mb-0 d-flex align-items-center" title={currentT.showAll}>
                            <input 
                                className="form-check-input cursor-pointer shadow-none m-0" 
                                type="checkbox" 
                                id="showAllSwitch"
                                checked={showAll}
                                onChange={() => setShowAll(!showAll)}
                                style={{ width: '2.4em', height: '1.2em' }}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="overflow-auto flex-grow-1">
                    {filteredRooms.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-chat-square-dots display-4 opacity-25 d-block mb-3"></i>
                            <div className="small">{searchTerm ? currentT.noMatches : currentT.noActiveRequests}</div>
                        </div>
                    ) : (
                        filteredRooms.map(roomId => (
                            <div
                                key={roomId}
                                onClick={() => setActiveRoom(roomId)}
                                className={`p-3 border-bottom cursor-pointer transition-all ${activeRoom === roomId ? 'bg-white border-start border-4 border-primary' : 'hover-bg-light'}`}
                                style={{ position: 'relative' }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="fw-bold small text-dark">{roomId.startsWith('Guest_') ? roomId.replace('Guest_', 'Guest #') : roomId}</span>
                                    {activeRoom !== roomId && chats[roomId]?.messages?.length > 0 && (
                                        <span className="badge rounded-pill bg-primary" style={{ fontSize: '0.6rem' }}>
                                            {chats[roomId].messages.length}
                                        </span>
                                    )}
                                </div>
                                <div className="small text-muted text-truncate" style={{ maxWidth: '240px' }}>
                                    {chats[roomId].lastMessage || (chats[roomId].messages?.length > 0 ? chats[roomId].messages[chats[roomId].messages.length - 1].text : '')}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow-1 d-flex flex-column bg-white">
                {activeRoom ? (
                    <>
                        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary-subtle p-2 rounded-circle me-3">
                                    <i className="bi bi-person-fill text-primary"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">{currentT.chatWith} {activeRoom}</h6>
                                    <span className="small text-success">● Online</span>
                                </div>
                            </div>
                            <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill">{currentT.patientSupport}</span>
                        </div>

                        <div className="flex-grow-1 p-4 overflow-auto" style={{ background: '#f1f5f9' }}>
                            {chats[activeRoom]?.messages?.map((msg, i) => (
                                <div key={i} className={`d-flex mb-3 ${msg.sender === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <div className="p-3 rounded-4 shadow-sm" style={{
                                        maxWidth: '75%',
                                        background: msg.sender === 'admin' ? '#4f46e5' : 'white',
                                        color: msg.sender === 'admin' ? '#ffffff' : '#1e293b',
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

                        <div className="p-4 bg-white border-top">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control border-0 bg-light rounded-pill px-4 py-2"
                                    placeholder={currentT.typeResponse}
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    className="btn btn-primary rounded-circle ms-3 d-flex align-items-center justify-content-center"
                                    onClick={handleSend}
                                    style={{ width: '45px', height: '45px', background: '#4f46e5', border: 'none' }}
                                >
                                    <i className="bi bi-send-fill"></i>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted p-5 text-center">
                        <div className="bg-light p-5 rounded-circle mb-4">
                            <i className="bi bi-chat-left-dots display-1 opacity-25"></i>
                        </div>
                        <h5 className="text-dark fw-bold">{currentT.selectConversation}</h5>
                        <p className="small max-w-sm mx-auto">{currentT.patientInquiries}</p>
                    </div>
                )}
            </div>

            <style>{`
                .hover-bg-light:hover { background: #f8fafc; }
                .bg-primary-subtle { background: #e0e7ff; }
                .bg-soft-primary { background: #eff6ff; }
                .transition-all { transition: all 0.2s ease; }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </div>
    );
};

export default AdminChatManager;
