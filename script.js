import { GameSaveSerializer } from './gameSaveSerializer.js';

const container = document.getElementById('jsoneditor');
const options = {
    mode: 'tree',
    modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
};
const editor = new JSONEditor(container, options);

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
