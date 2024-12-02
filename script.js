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

    // Check if the file contains "AntimatterDimensionsAndroidSaveFormat"
    if (input.includes('AntimatterDimensionsAndroidSaveFormat')) {
        alert("The 'AntimatterDimensionsAndroidSaveFormat' is not supported.");
        return;
    }

    // Proceed with decryption if the format is valid
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
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    
    const isDarkMode = document.body.classList.contains('dark-theme');
    toggleThemeButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Set initial icon based on the mode
const isDarkMode = document.body.classList.contains('dark-theme');
toggleThemeButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';



document.addEventListener('DOMContentLoaded', async () => {
    const repo = 'Sato-Isolated/Antimatter-Dimensions-Save-Editor';
    const apiUrl = `https://api.github.com/repos/${repo}?t=${new Date().getTime()}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub data');
        }

        const repoData = await response.json();

        // Update stars, forks, and issues in the DOM
        document.getElementById('githubStars').textContent = repoData.stargazers_count;
        document.getElementById('githubForks').textContent = repoData.forks_count;
        document.getElementById('githubIssues').textContent = repoData.open_issues_count;
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    }
});