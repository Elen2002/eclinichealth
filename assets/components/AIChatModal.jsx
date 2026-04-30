import React, { useState, useEffect, useRef } from 'react';
import { t } from '../utils/translations.js';
import aiAssistant from '../img/ai-assistant.png';

const AIChatModal = ({ isOpen, onClose, locale }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                sender: 'ai',
                text: t('home.aiChat.welcome', locale),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    }, [isOpen]);

    useEffect(scrollToBottom, [messages, isTyping]);

    if (!isOpen) return null;

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg = {
            sender: 'user',
            text: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Pro AI Logic
        fetch('/api/ai/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms: userMsg.text })
        })
            .then(res => res.json())
            .then(data => {
                let aiMsg;
                if (data.status === 'success') {
                    const urgencyText = t(`home.aiChat.diag.${data.urgency}`, locale);
                    aiMsg = {
                        sender: 'ai',
                        isDiagnostic: true,
                        disease: data.disease,
                        department: data.department,
                        urgency: data.urgency,
                        urgencyText: urgencyText,
                        recommendation: data.recommendation,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                } else if (data.status === 'conversational' || data.status === 'unknown') {
                    aiMsg = {
                        sender: 'ai',
                        text: t(data.translationKey, locale),
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                } else {
                    aiMsg = {
                        sender: 'ai',
                        text: t('home.aiChat.response.default', locale),
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }

                setMessages(prev => [...prev, aiMsg]);
                setIsTyping(false);
            })
            .catch(() => {
                setMessages(prev => [...prev, {
                    sender: 'ai',
                    text: t('home.aiChat.error', locale) || "I'm having trouble connecting to the medical network. Please try again.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                setIsTyping(false);
            });
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }} onClick={onClose}>
            <div className="chat-modal" style={{
                width: '100%',
                maxWidth: '500px',
                height: '600px',
                background: 'white',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="chat-header p-3 px-4 d-flex align-items-center justify-content-between" style={{ background: 'var(--brand-color)', color: 'white' }}>
                    <div className="d-flex align-items-center gap-2">
                        <img src={aiAssistant} alt="AI" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white' }} />
                        <span className="fw-bold">{t('home.aiChat.title', locale)}</span>
                    </div>
                    <button className="btn-close btn-close-white" onClick={onClose}></button>
                </div>

                {/* Messages Area */}
                <div className="chat-body flex-grow-1 p-4 overflow-auto" style={{ background: '#f1f5f9' }}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`d-flex mb-4 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                            {msg.isDiagnostic ? (
                                <div className="medical-card glass-card p-4 rounded-4 shadow-sm border-0 border-start border-4" style={{
                                    maxWidth: '90%',
                                    background: 'white',
                                    borderColor: msg.urgency === 'urgent' ? '#ef4444' : 'var(--brand-color)',
                                }}>
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <i className={`bi ${msg.urgency === 'urgent' ? 'bi-exclamation-triangle-fill text-danger' : 'bi-info-circle-fill text-primary'}`}></i>
                                        <h6 className="mb-0 fw-bold">{t('home.aiChat.diag.title', locale)}</h6>
                                    </div>
                                    <div className="mb-2">
                                        <small className="text-muted d-block">{t('home.aiChat.diag.possible', locale)}</small>
                                        <span className="fw-bold text-capitalize">{msg.disease}</span>
                                    </div>
                                    <div className="mb-2">
                                        <small className="text-muted d-block">{t('home.aiChat.diag.dept', locale)}</small>
                                        <span className="fw-bold">{msg.department}</span>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted d-block">{t('home.aiChat.diag.urgency', locale)}</small>
                                        <span className={`badge rounded-pill ${msg.urgency === 'urgent' ? 'bg-danger' : 'bg-primary'}`}>
                                            {msg.urgencyText}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-light rounded-3 small border">
                                        {msg.recommendation}
                                    </div>
                                    <div className="text-end mt-2" style={{ fontSize: '0.65rem', opacity: 0.7 }}>{msg.time}</div>
                                </div>
                            ) : (
                                <div className={`p-3 rounded-4 shadow-sm`} style={{
                                    maxWidth: '80%',
                                    background: msg.sender === 'user' ? 'var(--brand-color)' : 'white',
                                    color: msg.sender === 'user' ? 'white' : '#1e293b',
                                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '20px',
                                    borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '20px',
                                }}>
                                    <p className="mb-1 small">{msg.text}</p>
                                    <div className="text-end" style={{ fontSize: '0.65rem', opacity: 0.7 }}>{msg.time}</div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="d-flex mb-3 justify-content-start">
                            <div className="p-3 rounded-4 shadow-sm bg-white" style={{ maxWidth: '80%', borderBottomLeftRadius: '4px' }}>
                                <div className="typing-indicator d-flex gap-1">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="chat-footer p-3 px-4 bg-white border-top">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control border-0 bg-light rounded-pill px-4"
                            placeholder={t('home.aiChat.placeholder', locale)}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            style={{ height: '48px' }}
                        />
                        <button
                            className="btn btn-purple rounded-circle ms-2 d-flex align-items-center justify-content-center"
                            onClick={handleSend}
                            style={{ width: '48px', height: '48px', background: 'var(--brand-color)', color: 'white' }}
                        >
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </div>
                </div>

                <style>{`
                    .typing-indicator .dot {
                        width: 6px;
                        height: 6px;
                        background: #94a3b8;
                        border-radius: 50%;
                        animation: typing 1s infinite ease-in-out;
                    }
                    .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
                    .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
                    @keyframes typing {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AIChatModal;
