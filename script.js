import { GameSaveSerializer } from './gameSaveSerializer.js';

// Utility function for feedback
const showFeedback = (message, type = 'success') => {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
};

// Button loading state handler
const setButtonLoading = (button, isLoading) => {
    button.disabled = isLoading;
    button.classList.toggle('loading', isLoading);
};

// Initialize JSON Editor with enhanced options
const container = document.getElementById('jsoneditor');
const options = {
    mode: 'tree',
    modes: ['code', 'form', 'text', 'tree', 'view'],
    onError: (err) => {
        showFeedback(err.toString(), 'error');
    },
    onModeChange: (newMode) => {
        localStorage.setItem('preferredMode', newMode);
    }
};
const editor = new JSONEditor(container, options);

// Restore preferred mode
const savedMode = localStorage.getItem('preferredMode');
if (savedMode) editor.setMode(savedMode);

// Paste button handler
document.getElementById('pasteButton').addEventListener('click', async () => {
    const button = document.getElementById('pasteButton');
    setButtonLoading(button, true);
    
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('input').value = text;
        showFeedback('Save data pasted successfully');
    } catch (err) {
        showFeedback('Failed to read clipboard: ' + err, 'error');
    } finally {
        setButtonLoading(button, false);
    }
});

// Decrypt button handler
document.getElementById('decryptButton').addEventListener('click', () => {
    const button = document.getElementById('decryptButton');
    const input = document.getElementById('input').value;
    
    if (!input.trim()) {
        showFeedback('Please paste your save data first', 'error');
        return;
    }

    setButtonLoading(button, true);

    try {
        if (input.includes('AntimatterDimensionsAndroidSaveFormat')) {
            showFeedback('Android format is not supported', 'error');
            return;
        }

        const output = GameSaveSerializer.deserialize(input);
        if (output) {
            editor.set(output);
            showFeedback('Save data decrypted successfully');
        } else {
            showFeedback('Failed to decrypt save data', 'error');
        }
    } catch (err) {
        showFeedback('Decryption error: ' + err, 'error');
    } finally {
        setButtonLoading(button, false);
    }
});

// Encrypt button handler
document.getElementById('encryptButton').addEventListener('click', () => {
    const button = document.getElementById('encryptButton');
    setButtonLoading(button, true);
    
    try {
        const json = editor.get();
        const output = GameSaveSerializer.serialize(json);
        document.getElementById('output').value = output;
        showFeedback('Save data encrypted successfully');
    } catch (err) {
        showFeedback('Encryption error: ' + err, 'error');
    } finally {
        setButtonLoading(button, false);
    }
});

// Copy button handler
document.getElementById('copyButton').addEventListener('click', async () => {
    const button = document.getElementById('copyButton');
    const output = document.getElementById('output').value;
    
    if (!output.trim()) {
        showFeedback('No data to copy', 'error');
        return;
    }

    setButtonLoading(button, true);
    
    try {
        await navigator.clipboard.writeText(output);
        showFeedback('Copied to clipboard');
    } catch (err) {
        showFeedback('Failed to copy: ' + err, 'error');
    } finally {
        setButtonLoading(button, false);
    }
});

// Theme toggle with persistence
const toggleThemeButton = document.getElementById('toggleTheme');
const setTheme = (isDark) => {
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    toggleThemeButton.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Initialize theme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

toggleThemeButton.addEventListener('click', () => {
    const isDark = document.body.classList.contains('light-theme');
    setTheme(isDark);
});

// GitHub stats with error handling and retry
const fetchGitHubStats = async (retries = 3) => {
    const repo = 'Sato-Isolated/Antimatter-Dimensions-Save-Editor';
    const apiUrl = `https://api.github.com/repos/${repo}?t=${new Date().getTime()}`;
    
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            document.getElementById('githubStars').textContent = data.stargazers_count;
            document.getElementById('githubForks').textContent = data.forks_count;
            document.getElementById('githubIssues').textContent = data.open_issues_count;
            return;
        } catch (err) {
            if (i === retries - 1) {
                console.error('Failed to fetch GitHub stats:', err);
                document.querySelector('.github-badges').style.opacity = '0.5';
            } else {
                await new Promise(r => setTimeout(r, 1000 * (i + 1)));
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', fetchGitHubStats);