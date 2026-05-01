import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const DoctorPatientChatPage = ({ doctor, patient, locale = 'en' }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);

    const userId = patient?.identifier || 'Patient';
    const doctorId = doctor?.id || 'Doctor';
    const roomId = `pair_${userId}_${doctorId}`;

    useEffect(() => {
        // Load history from DB
        fetch(`/api/chat/history/${roomId}`)
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(msg => ({
                    id: msg.id,
                    text: msg.content,
                    sender: msg.sender.id === patient.id ? 'user' : 'doctor',
                    time: msg.createdAt
                }));
                setMessages(formatted);
            })
            .catch(err => console.error('Failed to load chat history:', err));

        const socketUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
        const newSocket = io(socketUrl, {
            transports: ['websocket']
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server, joining room:', roomId);
            newSocket.emit('join_support', { userId: userId, roomId: roomId });
        });

        newSocket.on('message', (msg) => {
            if (msg.roomId === roomId) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: msg.text,
                    sender: msg.sender || 'doctor',
                    time: new Date()
                }]);
            }
        });

        return () => newSocket.close();
    }, [userId, roomId, patient.id]);

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            id: 'temp-' + Date.now(),
            text: inputValue,
            sender: 'user',
            time: new Date(),
            roomId: roomId
        };

        setMessages(prev => [...prev, newMessage]);
        
        socket?.emit('chat_message', { 
            text: inputValue,
            sender: 'user',
            roomId: roomId,
            targetId: doctor.identifier || doctorId,
            email: patient?.email || null
        });

        // Save to DB
        fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: inputValue,
                roomId: roomId,
                targetId: doctor.id
            })
        }).catch(err => console.error('Failed to save message to DB:', err));

        // Save persistent notification for the recipient
        fetch('/api/notifications/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetIdentifier: doctor.identifier,
                title: 'New Chat Message',
                message: inputValue.substring(0, 100),
                type: 'chat',
                link: '/' + locale + '/profile/chat/' + doctor.id
            })
        }).catch(err => console.error('Failed to save notification:', err));

        setInputValue('');
    };

    return (
        <div className="container-fluid pb-0" style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', marginTop: '80px', paddingTop: '20px', display: 'flex', flexDirection: 'column' }}>
            <div className="row flex-grow-1 justify-content-center pb-4">
                <div className="col-lg-10 d-flex flex-column">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column flex-grow-1" style={{ minHeight: '600px', height: 'calc(100vh - 140px)' }}>
                        {/* Chat Header */}
                        <div className="card-header p-4 bg-white border-bottom d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="position-relative">
                                    <img src={doctor.avatar || '/img/default-doctor.png'} className="rounded-circle shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover' }} alt="" />
                                    <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">{doctor.name}</h5>
                                    <p className="text-primary small mb-0 fw-bold">{doctor.specialty || 'Medical Specialist'}</p>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: 'white', border: '1px solid #eee' }}><i className="bi bi-telephone text-primary"></i></button>
                                <button className="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: 'white', border: '1px solid #eee' }}><i className="bi bi-three-dots-vertical text-muted"></i></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="card-body p-4 flex-grow-1 overflow-auto" style={{ background: '#f1f5f9' }} ref={messagesContainerRef}>
                            {messages.length === 0 ? (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted opacity-50 py-5">
                                    <i className="bi bi-chat-heart display-1 mb-3"></i>
                                    <h5>{locale === 'hy' ? 'Սկսեք զրույցը' : 'Start a conversation'}</h5>
                                    <p className="small">{locale === 'hy' ? 'Ողջույն ասեք ձեր բժշկին' : 'Say hello to your doctor'}</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`d-flex mb-4 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div className={`p-3 rounded-4 shadow-sm`} style={{
                                            maxWidth: '70%',
                                            background: msg.sender === 'user' ? 'var(--brand-color)' : 'white',
                                            color: msg.sender === 'user' ? 'white' : '#1e293b',
                                            borderBottomRightRadius: msg.sender === 'user' ? '4px' : '20px',
                                            borderBottomLeftRadius: msg.sender === 'user' ? '20px' : '4px',
                                            position: 'relative'
                                        }}>
                                            <div className="fw-bold mb-1" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                                {msg.sender === 'user' ? (locale === 'hy' ? 'Դուք' : 'You') : doctor.name}
                                            </div>
                                            <div>{msg.text}</div>
                                            <div className="text-end mt-1" style={{ fontSize: '0.65rem', opacity: 0.6 }}>
                                                {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="card-footer p-4 bg-white border-top">
                            <div className="input-group gap-2">
                                <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '48px', height: '48px' }}><i className="bi bi-paperclip"></i></button>
                                <input
                                    type="text"
                                    className="form-control border-0 bg-light rounded-pill px-4"
                                    placeholder={locale === 'hy' ? 'Գրեք Ձեր հաղորդագրությունը...' : 'Type your message here...'}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    style={{ height: '48px', fontSize: '1rem' }}
                                />
                                <button
                                    className="btn btn-primary rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                    onClick={handleSend}
                                    style={{ width: '48px', height: '48px', background: 'var(--brand-gradient)', border: 'none' }}
                                >
                                    <i className="bi bi-send-fill fs-5"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorPatientChatPage;
