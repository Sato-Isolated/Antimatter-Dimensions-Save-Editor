import { GameSaveSerializer } from './gameSaveSerializer.js';

const container = document.getElementById('jsoneditor');
const options = {
    mode: 'tree',
    modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
};
const editor = new JSONEditor(container, options);

document.getElementById('pasteButton').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('input').value = text;
    } catch (err) {
        alert('Failed to read clipboard contents: ' + err);
    }
});

document.getElementById('decryptButton').addEventListener('click', () => {
    const input = document.getElementById('input').value;
    const output = GameSaveSerializer.deserialize(input);
    if (output) {
        editor.set(output);
    } else {
        alert('Decryption error');
    }
});

document.getElementById('encryptButton').addEventListener('click', () => {
    const json = editor.get();
    const output = GameSaveSerializer.serialize(json);
    document.getElementById('output').value = output;
});

document.getElementById('copyButton').addEventListener('click', () => {
    const output = document.getElementById('output').value;
    navigator.clipboard.writeText(output).then(() => {
        alert('Copied to clipboard');
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
});

// Toggle dark mode
const toggleThemeButton = document.getElementById('toggleTheme');
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleThemeButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Set initial icon based on the mode
const isDarkMode = document.body.classList.contains('dark-mode');
toggleThemeButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
