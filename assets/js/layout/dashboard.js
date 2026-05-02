/* Dashboard Layout Logic */
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
        const storedCount = parseInt(localStorage.getItem('admin_unread_count') || '0');
        
        fetch('/api/admin/chat/sessions')
            .then(res => res.json())
            .then(data => {
                // In a real app, logic would go here to determine if count changed
                updateUI(storedCount);
            })
            .catch(err => console.error('Failed to poll notifications:', err));
    }

    // Initial check
    const initialCount = parseInt(localStorage.getItem('admin_unread_count') || '0');
    updateUI(initialCount);
    
    // Poll for notifications every 15 seconds
    setInterval(fetchAdminNotifications, 15000);

    // Clear notifications when entering the support chat
    if (window.location.pathname.includes('/admin/support')) {
        localStorage.setItem('admin_unread_count', '0');
        updateUI(0);
    }
});
