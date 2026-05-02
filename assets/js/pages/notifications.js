/* Notifications Page Logic */
document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.notification-item.unread');
    items.forEach(item => {
        item.addEventListener('click', function(e) {
            const id = this.dataset.id;
            fetch(`/api/notifications/mark-read/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.style.background = 'white';
                    this.style.borderLeft = 'none';
                    const title = this.querySelector('h6');
                    if (title) title.classList.replace('text-primary', 'text-dark');
                    const dot = this.querySelector('.unread-dot');
                    if (dot) dot.remove();
                    this.classList.remove('unread');
                    this.classList.add('read');
                }
            });
        });
    });

    const markAllBtn = document.getElementById('mark-all-read');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', function() {
            fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
        });
    }
});
