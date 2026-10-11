const themeToggle = document.querySelector('.theme-toggle');
const themeStorageKey = 'magar-dev-theme';

function setTheme(isDarkMode) {
    document.body.classList.toggle('dark-mode', isDarkMode);

    if (themeToggle) {
        themeToggle.textContent = isDarkMode ? 'Light' : 'Dark';
        themeToggle.setAttribute(
            'aria-label',
            isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

setTheme(localStorage.getItem(themeStorageKey) === 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDarkMode = !document.body.classList.contains('dark-mode');
        localStorage.setItem(themeStorageKey, isDarkMode ? 'dark' : 'light');
        setTheme(isDarkMode);
    });
}