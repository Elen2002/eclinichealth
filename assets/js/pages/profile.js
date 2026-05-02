/* Profile Page Logic */
document.addEventListener('DOMContentLoaded', function() {
    const avatarInput = document.querySelector('[data-avatar-input]');
    const previewImages = document.querySelectorAll('img[data-profile-preview]');

    if (avatarInput) {
        avatarInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImages.forEach(img => {
                        img.src = e.target.result;
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
