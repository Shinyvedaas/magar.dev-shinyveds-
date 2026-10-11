const lengthInput = document.getElementById('password-length');
const uppercase = document.getElementById('include-uppercase');
const lowercase = document.getElementById('include-lowercase');
const numbers = document.getElementById('include-numbers');
const symbols = document.getElementById('include-symbols');
const generateBtn = document.getElementById('generate-password');
const copyBtn = document.getElementById('copy-password');
const output = document.getElementById('password-output');

const CHARS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

function buildCharset() {
    let charset = '';
    if (uppercase.checked) charset += CHARS.uppercase;
    if (lowercase.checked) charset += CHARS.lowercase;
    if (numbers.checked) charset += CHARS.numbers;
    if (symbols.checked) charset += CHARS.symbols;
    return charset;
}

function generatePassword() {
    const charset = buildCharset();
    if (!charset) {
        output.textContent = 'Select at least one character type.';
        return;
    }

    const length = Math.min(128, Math.max(8, Number(lengthInput.value) || 16));
    lengthInput.value = length;

    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[bytes[i] % charset.length];
    }

    output.textContent = password;
}

async function copyPassword() {
    const password = output.textContent;
    // Ignore status messages instead of treating them as generated passwords.
    if (!password || password.startsWith('Click') || password.startsWith('Select') || password.startsWith('Copy failed')) return;

    try {
        await navigator.clipboard.writeText(password);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
    } catch {
        output.textContent = 'Copy failed. Select and copy it manually.';
    }
}

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);