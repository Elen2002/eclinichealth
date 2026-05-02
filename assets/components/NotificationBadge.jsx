import React, { useState, useEffect } from 'react';

const NotificationBadge = ({ user = null, locale = 'en' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = () => {
            fetch('/api/notifications/unread-count')
                .then(res => res.json())
                .then(data => {
                    if (data.count !== undefined) {
                        setCount(data.count);
                    }
                })
                .catch(err => console.error('Failed to fetch notifications:', err));
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
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
