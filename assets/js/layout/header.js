/* Global Header Logic */
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const langBtn = document.getElementById('lang-selector-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileClose = document.getElementById('mobile-nav-close');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 20) {
                header.classList.add('shadow-sm');
                header.style.backgroundColor = 'rgba(248, 250, 252, 0.98)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.classList.remove('shadow-sm');
                header.style.backgroundColor = 'rgba(248, 250, 252, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        }
    });

    // Language dropdown
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('d-none');
        });
        document.addEventListener('click', () => {
            if (langDropdown) langDropdown.classList.add('d-none');
        });
    }

    // Mobile nav
    if (mobileToggle && mobileOverlay) {
        mobileToggle.addEventListener('click', () => mobileOverlay.classList.remove('d-none'));
        if (mobileClose) {
            mobileClose.addEventListener('click', () => mobileOverlay.classList.add('d-none'));
        }
    }
});
