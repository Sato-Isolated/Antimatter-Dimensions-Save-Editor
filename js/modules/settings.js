class SettingsManager {
    constructor() {
        this.defaultSettings = {
            defaultEditor: 'structured',
            theme: 'system',
            autoSave: true
        };

        this.themes = {
            system: 'System',
            light: 'Light',
            dark: 'Dark',
            antimatter: 'Antimatter',
            infinity: 'Infinity',
            eternity: 'Eternity',
            reality: 'Reality'
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
            // Clear existing options
            themeSelect.innerHTML = '';
            
            // Add theme options
            Object.entries(this.themes).forEach(([value, label]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = label;
                themeSelect.appendChild(option);
            });
            
            themeSelect.value = this.settings.theme;
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.saveSettings();
                this.applySettings();
            });
        }
    }

    applySettings() {
        // Determine theme
        let theme = this.settings.theme;
        if (theme === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = `${theme}-theme`;

        // Apply default editor view
        const defaultEditor = this.settings.defaultEditor;
        const editorId = defaultEditor === 'json' ? 'json-editor' : 'structured-editor';
        
        // Update panes and buttons
        document.querySelectorAll('.tab-pane').forEach(pane => {
            if (pane.id === editorId) {
                pane.style.display = 'block';
                pane.style.visibility = 'visible';
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
                pane.style.visibility = 'hidden';
                pane.style.display = 'none';
            }
        });
        
        document.querySelectorAll('.tab-button').forEach(button => {
            const isActive = button.getAttribute('data-tab') === defaultEditor;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', isActive.toString());
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