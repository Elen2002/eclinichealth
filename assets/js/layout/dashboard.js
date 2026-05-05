
document.addEventListener('DOMContentLoaded', function() {
    const dot = document.querySelector('.notification-dot');
    const chatBadge = document.getElementById('chat-notification-badge');
    
    function updateUI(unreadCount) {
        if (unreadCount > 0) {
            if (dot) dot.style.display = 'block';
            if (chatBadge) {
                chatBadge.innerText = unreadCount;
                chatBadge.classList.remove('d-none');
            }
        } else {
            if (dot) dot.style.display = 'none';
            if (chatBadge) chatBadge.classList.add('d-none');
        }
    }

    function fetchAdminNotifications() {
        
        const user = window.APP_DATA?.user;
        if (!user || !user.roles || (!user.roles.includes('ROLE_ADMIN') && !user.roles.includes('ROLE_SUPER_ADMIN'))) {
            return;
        }

        const storedCount = parseInt(localStorage.getItem('admin_unread_count') || '0');
        
        fetch('/api/admin/chat/sessions')
            .then(res => res.json())
            .then(data => {
                
                updateUI(storedCount);
            })
            .catch(err => console.error('Failed to poll notifications:', err));
    }

    
    const initialCount = parseInt(localStorage.getItem('admin_unread_count') || '0');
    updateUI(initialCount);
    
    
    setInterval(fetchAdminNotifications, 15000);

    
    if (window.location.pathname.includes('/admin/support')) {
        localStorage.setItem('admin_unread_count', '0');
        updateUI(0);
    }
});
