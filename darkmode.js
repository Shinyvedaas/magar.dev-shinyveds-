const themeToggle = document.querySelector('.theme-toggle');
const themeStorageKey = 'magar-dev-theme';

// Apply the selected theme without relying on storage being available.
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

function loadThemePreference() {
    try {
        return localStorage.getItem(themeStorageKey) === 'dark';
    } catch (error) {
        console.error('Could not read the saved theme preference.', error);
        return false;
    }
}

function saveThemePreference(isDarkMode) {
    try {
        localStorage.setItem(themeStorageKey, isDarkMode ? 'dark' : 'light');
    } catch (error) {
        console.error('Could not save the theme preference.', error);
    }
}

setTheme(loadThemePreference());

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDarkMode = !document.body.classList.contains('dark-mode');
        saveThemePreference(isDarkMode);
        setTheme(isDarkMode);
    });
}