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

let generatedPassword = '';

// Rejection sampling avoids the modulo bias of mapping random integers to a character set.
function randomIndex(maximum) {
    const range = 0x100000000;
    const limit = Math.floor(range / maximum) * maximum;
    const value = new Uint32Array(1);

    do {
        crypto.getRandomValues(value);
    } while (value[0] >= limit);

    return value[0] % maximum;
}

function generatePassword() {
    const selectedSets = [];
    if (uppercase.checked) selectedSets.push(CHARS.uppercase);
    if (lowercase.checked) selectedSets.push(CHARS.lowercase);
    if (numbers.checked) selectedSets.push(CHARS.numbers);
    if (symbols.checked) selectedSets.push(CHARS.symbols);

    if (selectedSets.length === 0) {
        generatedPassword = '';
        output.textContent = 'Select at least one character type.';
        return;
    }

    const requestedLength = Number(lengthInput.value);
    const length = Math.min(128, Math.max(8, Math.trunc(requestedLength) || 16));
    lengthInput.value = length;

    const charset = selectedSets.join('');
    const characters = selectedSets.map((set) => set[randomIndex(set.length)]);

    while (characters.length < length) {
        characters.push(charset[randomIndex(charset.length)]);
    }

    // Shuffle required characters so the selected categories are not predictable by position.
    for (let index = characters.length - 1; index > 0; index -= 1) {
        const swapIndex = randomIndex(index + 1);
        [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
    }

    generatedPassword = characters.join('');
    output.textContent = generatedPassword;
}

async function copyPassword() {
    if (!generatedPassword) return;

    try {
        await navigator.clipboard.writeText(generatedPassword);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
    } catch (error) {
        console.error('Could not copy the generated password.', error);
        copyBtn.textContent = 'Copy failed';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
    }
}

if (lengthInput && uppercase && lowercase && numbers && symbols && generateBtn && copyBtn && output) {
    generateBtn.addEventListener('click', () => {
        try {
            generatePassword();
        } catch (error) {
            generatedPassword = '';
            output.textContent = 'Password generation failed. Please try again.';
            console.error('Could not generate a secure password.', error);
        }
    });
    copyBtn.addEventListener('click', copyPassword);
}