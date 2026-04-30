import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const NotificationBadge = ({ user = null, locale = 'en' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const socketUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
        const socket = io(socketUrl, {
            transports: ['websocket']
        });

        // Listen for messages that are targeted to this user
        socket.on('connect', () => {
            console.log('Notification socket connected');
            socket.emit('join_notifications', { userId: user.identifier || user.email });
        });

        socket.on('new_notification', (data) => {
            if (data.type === 'chat_message') {
                // Only increment if we are not on the chat page for this doctor
                // Or if it's a new message in a different room
                setCount(prev => prev + 1);
                
                // Play subtle sound
                try {
                    const audio = new Audio('/sounds/notification.mp3');
                    audio.play();
                } catch (e) {}
            }
        });

        return () => socket.close();
    }, [user]);

    if (!user) return null;

    return (
        <div className="position-relative cursor-pointer hover-scale" onClick={() => window.location.href = `/${locale}/profile/notifications`}>
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-white border shadow-sm" 
                 style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}>
                <i className="bi bi-bell text-primary fs-5"></i>
            </div>
            {count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" 
                      style={{ fontSize: '0.6rem', padding: '0.35em 0.5em', minWidth: '1.5em', zIndex: 10 }}>
                    {count}
                </span>
            )}
            
            <style dangerouslySetInnerHTML={{ __html: `
                .hover-scale:hover { transform: scale(1.1); }
            ` }} />
        </div>
    );
};

export default NotificationBadge;
