import React, { useState, useEffect, useRef } from 'react';

const DoctorPatientChatPage = ({ doctor, patient, user, doctors = [], locale = 'en' }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    
    // Detect if the logged-in user is the doctor in this conversation
    const isDoctorViewer = user && (user.id === doctor.user?.id || user.roles.includes('ROLE_DOCTOR'));

    // The Room ID must be consistent for both parties: pair_PATIENT_DOCTOR
    const userId = patient?.identifier || 'Patient';
    const drId = doctor?.id || 'Doctor';
    const roomId = `pair_${userId}_${drId}`;

    useEffect(() => {
        const fetchHistory = () => {
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
        };

        fetchHistory(); // Initial load
        const interval = setInterval(fetchHistory, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
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
            <div className="row flex-grow-1">
                {/* Doctors Sidebar */}
                <div className="col-lg-3 col-md-4 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                        <div className="card-header bg-white border-0 py-4 px-4 d-flex align-items-center justify-content-between">
                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-people-fill text-primary me-2"></i>
                                {isDoctorViewer 
                                    ? (locale === 'hy' ? 'Իմ պացիենտները' : 'My Patients')
                                    : (locale === 'hy' ? 'Իմ բժիշկները' : 'My Doctors')
                                }
                            </h5>
                            <a href={isDoctorViewer ? `/${locale}/doctor/dashboard` : `/${locale}/profile`} className="btn btn-light btn-sm rounded-circle shadow-sm" title={locale === 'hy' ? 'Վերադառնալ' : 'Back'}>
                                <i className="bi bi-arrow-left"></i>
                            </a>
                        </div>
                        <div className="card-body p-0 overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                            <div className="list-group list-group-flush">
                                {doctors.map((contact) => (
                                    <a
                                        key={contact.id}
                                        href={isDoctorViewer 
                                            ? `/${locale}/profile/chat/${doctor.id}/${contact.id}`
                                            : `/${locale}/profile/chat/${contact.id}`
                                        }
                                        className={`list-group-item list-group-item-action border-0 py-3 px-4 d-flex align-items-center gap-3 transition-all ${
                                            (isDoctorViewer ? patient.id === contact.id : doctor.id === contact.id) 
                                            ? 'bg-primary-subtle border-start border-4 border-primary' 
                                            : ''
                                        }`}
                                    >
                                        <div className="position-relative">
                                            <img 
                                                src={contact.avatar && contact.avatar !== '' ? contact.avatar : (isDoctorViewer ? '/img/default-avatar.png' : '/img/default-doctor.png')} 
                                                className="rounded-circle shadow-sm" 
                                                style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
                                                alt="" 
                                                onError={(e) => { e.target.src = isDoctorViewer ? '/img/default-avatar.png' : '/img/default-doctor.png'; }}
                                            />
                                            <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '10px', height: '10px' }}></span>
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="fw-bold text-dark text-truncate mb-0" style={{ fontSize: '0.9rem' }}>{contact.name}</div>
                                            <div className="text-muted small text-truncate" style={{ fontSize: '0.75rem' }}>{contact.specialty}</div>
                                        </div>
                                        {(isDoctorViewer ? patient.id === contact.id : doctor.id === contact.id) && (
                                            <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                        )}
                                    </a>
                                ))}
                                {doctors.length === 0 && (
                                    <div className="p-5 text-center text-muted small">
                                        <i className="bi bi-person-x d-block fs-2 mb-2 opacity-25"></i>
                                        {isDoctorViewer 
                                            ? (locale === 'hy' ? 'Պացիենտներ չեն գտնվել' : 'No patients found')
                                            : (locale === 'hy' ? 'Բժիշկներ չեն գտնվել' : 'No doctors found')
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="col-lg-9 col-md-8 d-flex flex-column mb-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column flex-grow-1" style={{ minHeight: '600px', height: 'calc(100vh - 140px)' }}>
                        {/* Chat Header */}
                        <div className="card-header p-3 bg-white border-bottom d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="position-relative">
                                    <img 
                                        src={chatPartner.avatar && chatPartner.avatar !== '' ? chatPartner.avatar : (isDoctorViewer ? '/img/default-avatar.png' : '/img/default-doctor.png')} 
                                        className="rounded-circle shadow-sm" 
                                        style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
                                        alt="" 
                                        onError={(e) => { e.target.src = isDoctorViewer ? '/img/default-avatar.png' : '/img/default-doctor.png'; }}
                                    />
                                    <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0">{chatPartner.name || chatPartner.identifier}</h6>
                                    <p className="text-primary small mb-0" style={{ fontSize: '0.7rem', fontWeight: '600' }}>{isDoctorViewer ? 'Patient' : (chatPartner.specialty || 'Medical Specialist')}</p>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #eee' }}><i className="bi bi-telephone text-primary small"></i></button>
                                <button className="btn btn-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: 'white', border: '1px solid #eee' }}><i className="bi bi-three-dots-vertical text-muted small"></i></button>
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
                                            background: msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? 'linear-gradient(135deg, var(--brand-color), var(--accent-color))' : 'white',
                                            color: msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? '#ffffff' : '#1e293b',
                                            borderBottomRightRadius: msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? '4px' : '20px',
                                            borderBottomLeftRadius: msg.sender === (isDoctorViewer ? 'doctor' : 'user') ? '20px' : '4px',
                                        }}>
                                            <div className="message-content" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{msg.text}</div>
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
                                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                    onClick={handleSend}
                                    style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, var(--brand-color), var(--accent-color))', border: 'none' }}
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
