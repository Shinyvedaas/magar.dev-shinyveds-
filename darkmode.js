const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');

        themeToggle.textContent = isDarkMode ? 'Normal' : 'Sombre';
        themeToggle.setAttribute(
            'aria-label',
            isDarkMode ? 'Passer au mode normal' : 'Passer au mode sombre'
        );
    });
}