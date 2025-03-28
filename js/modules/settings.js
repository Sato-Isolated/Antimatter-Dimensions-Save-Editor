class SettingsManager {
    constructor() {
        this.defaultSettings = {
            // Default editor view
            defaultEditor: 'structured',
            theme: 'system',
        };

        // Initialize with default settings
        this.settings = { ...this.defaultSettings };
        
        // Initialize after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.applySettings();
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('editorSettings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.defaultSettings, ...parsed };
            }
        } catch (e) {
            console.error('Error loading settings:', e);
            this.settings = { ...this.defaultSettings };
        }
        this.updateUI();
    }

    updateUI() {
        // Update editor view selection
        document.querySelectorAll('input[name="defaultEditor"]').forEach(input => {
            input.checked = input.value === this.settings.defaultEditor;
            input.addEventListener('change', (e) => {
                this.settings.defaultEditor = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        });

        // Update theme selection
        const themeSelect = document.querySelector('select[name="theme"]');
        if (themeSelect) {
            themeSelect.value = this.settings.theme;
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        }
    }

    applySettings() {
        // Apply theme
        const theme = this.settings.theme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : this.settings.theme;
            
        document.documentElement.setAttribute('data-theme', theme);

        // Apply default editor view
        const editorId = this.settings.defaultEditor === 'json' ? 'json-editor' : 'structured-editor';
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === editorId);
        });
        
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-tab') === this.settings.defaultEditor);
        });

        // Dispatch settings change event
        document.dispatchEvent(new CustomEvent('settingsChanged', { detail: this.settings }));
    }

    bindEvents() {
        // Reset button
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('Reset all settings to default values?')) {
                    this.settings = { ...this.defaultSettings };
                    this.saveSettings();
                    this.applySettings();
                    this.updateUI();
                }
            });
        }

        // System theme change detection
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
                if (this.settings.theme === 'system') {
                    this.applySettings();
                }
            });
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('editorSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    getDefaultEditor() {
        return this.settings.defaultEditor;
    }

    get(setting) {
        return this.settings[setting];
    }

    reset() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        this.applySettings();
        this.updateUI();
    }
}

export const settingsManager = new SettingsManager();