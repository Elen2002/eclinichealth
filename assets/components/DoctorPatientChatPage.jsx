import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const DoctorPatientChatPage = ({ doctor, patient, user, locale = 'en' }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);

    // Detect if the logged-in user is the doctor in this conversation
    const isDoctorViewer = user && (user.id === doctor.user?.id || user.roles.includes('ROLE_DOCTOR'));

    // The Room ID must be consistent for both parties: pair_PATIENT_DOCTOR
    // If the viewer is the doctor, 'patient' prop contains the REAL patient info.
    // If the viewer is the patient, 'patient' prop contains the viewer's info.
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
                    sender: msg.sender.id === (isDoctorViewer ? patient.id : user.id) ? 'user' : 'doctor',
                    time: msg.createdAt
                }));
                setMessages(formatted);
            })
            .catch(err => console.error('Failed to load chat history:', err));

        const socketUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
        const newSocket = io(socketUrl, {
            transports: ['polling']
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server, joining room:', roomId);
            newSocket.emit('join_support', { userId: user.identifier || user.id, roomId: roomId });
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
    }, [userId, roomId, patient.id, isDoctorViewer, user.id, user.identifier]);

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
            sender: isDoctorViewer ? 'doctor' : 'user',
            time: new Date(),
            roomId: roomId
        };

        setMessages(prev => [...prev, newMessage]);

        socket?.emit('chat_message', {
            text: inputValue,
            sender: isDoctorViewer ? 'doctor' : 'user',
            roomId: roomId,
            targetId: isDoctorViewer ? patient.id : doctor.id,
            email: user?.email || null
        });

        // Save to DB
        fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: inputValue,
                roomId: roomId,
                targetId: isDoctorViewer ? patient.id : doctor.id
            })
        }).catch(err => console.error('Failed to save message to DB:', err));

        // Save persistent notification for the recipient
        fetch('/api/notifications/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetIdentifier: isDoctorViewer ? patient.identifier : doctor.identifier,
                title: user.name || 'New Chat Message',
                message: inputValue.substring(0, 100),
                type: 'chat',
                link: '/' + locale + '/profile/chat/' + doctor.id + (isDoctorViewer ? '' : '/' + patient.id)
            })
        }).catch(err => console.error('Failed to save notification:', err));

        setInputValue('');
    };

    const chatPartner = isDoctorViewer ? patient : doctor;

    return (
        <div className="container-fluid pb-0" style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', marginTop: '80px', paddingTop: '20px', display: 'flex', flexDirection: 'column' }}>
            <div className="row flex-grow-1 justify-content-center pb-4">
                <div className="col-lg-10 d-flex flex-column">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column flex-grow-1" style={{ minHeight: '600px', height: 'calc(100vh - 140px)' }}>
                        {/* Chat Header */}
                        <div className="card-header p-4 bg-white border-bottom d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="position-relative">
                                    <img src={chatPartner.avatar || (isDoctorViewer ? '/img/default-avatar.png' : '/img/default-doctor.png')} className="rounded-circle shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover' }} alt="" />
                                    <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">{chatPartner.name || chatPartner.identifier}</h5>
                                    <p className="text-primary small mb-0 fw-bold">{isDoctorViewer ? 'Patient' : (chatPartner.specialty || 'Medical Specialist')}</p>
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
                                messages.map((msg, i) => (
                                    <div key={msg.id || i} className={`d-flex mb-4 ${msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div className={`p-3 rounded-4 shadow-sm`} style={{
                                            maxWidth: '75%',
                                            background: msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? 'var(--brand-gradient)' : 'white',
                                            color: msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? 'white' : '#1e293b',
                                            borderBottomRightRadius: msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? '4px' : '20px',
                                            borderBottomLeftRadius: msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? '20px' : '4px',
                                        }}>
                                            <div className="message-content">{msg.text}</div>
                                            <div className="text-end mt-2" style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                                                {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="card-footer p-3 bg-white border-top">
                            <div className="input-group gap-2">
                                <button className="btn btn-light rounded-circle" style={{ width: '45px', height: '45px' }}><i className="bi bi-plus-lg"></i></button>
                                <input
                                    type="text"
                                    className="form-control border-0 bg-light rounded-pill px-4"
                                    placeholder={locale === 'hy' ? 'Գրեք Ձեր հաղորդագրությունը...' : 'Type your message...'}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                                    onClick={handleSend}
                                    style={{ width: '45px', height: '45px', background: 'var(--brand-gradient)', border: 'none' }}
                                >
                                    <i className="bi bi-send-fill"></i>
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
