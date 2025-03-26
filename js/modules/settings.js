class SettingsManager {
    constructor() {
        this.settings = {
            defaultEditor: 'structured',
            autoSave: true,
            confirmDiscardChanges: true,
            compactMode: false,
            showAdvancedOptions: false
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.applySettings();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('editorSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        this.updateUI();
    }

    updateUI() {
        // Update radio buttons
        const defaultEditorInputs = document.querySelectorAll('input[name="defaultEditor"]');
        defaultEditorInputs.forEach(input => {
            input.checked = input.value === this.settings.defaultEditor;
        });

        // Update checkboxes
        document.querySelector('input[name="autoSave"]').checked = this.settings.autoSave;
        document.querySelector('input[name="confirmDiscardChanges"]').checked = this.settings.confirmDiscardChanges;
        document.querySelector('input[name="compactMode"]').checked = this.settings.compactMode;
        document.querySelector('input[name="showAdvancedOptions"]').checked = this.settings.showAdvancedOptions;
    }

    saveSettings() {
        localStorage.setItem('editorSettings', JSON.stringify(this.settings));
    }

    applySettings() {
        // Apply the default editor view
        const defaultTab = document.querySelector(`#${this.settings.defaultEditor}-tab`);
        if (defaultTab && !document.querySelector('.tab-button.active')) {
            defaultTab.click();
        }

        // Apply compact mode
        document.body.classList.toggle('compact-mode', this.settings.compactMode);

        // Apply advanced options visibility
        document.body.classList.toggle('show-advanced', this.settings.showAdvancedOptions);
    }

    bindEvents() {
        // Default editor selection
        document.querySelectorAll('input[name="defaultEditor"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.settings.defaultEditor = e.target.value;
                this.saveSettings();
            });
        });

        // Checkbox settings
        const checkboxSettings = ['autoSave', 'confirmDiscardChanges', 'compactMode', 'showAdvancedOptions'];
        checkboxSettings.forEach(setting => {
            document.querySelector(`input[name="${setting}"]`).addEventListener('change', (e) => {
                this.settings[setting] = e.target.checked;
                this.saveSettings();
                this.applySettings();
            });
        });

        // Save button
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
            // Show success feedback
            const button = document.getElementById('saveSettings');
            button.classList.add('success');
            button.innerHTML = '<i class="fas fa-check"></i> Saved';
            setTimeout(() => {
                button.classList.remove('success');
                button.innerHTML = '<i class="fas fa-save"></i> Save Settings';
            }, 2000);
        });

        // Reset button
        document.getElementById('resetSettings').addEventListener('click', () => {
            if (!this.settings.confirmDiscardChanges || confirm('Reset all settings to default values?')) {
                this.settings = {
                    defaultEditor: 'structured',
                    autoSave: true,
                    confirmDiscardChanges: true,
                    compactMode: false,
                    showAdvancedOptions: false
                };
                this.saveSettings();
                this.updateUI();
                this.applySettings();
            }
        });
    }

    // Getter methods for other modules
    getDefaultEditor() {
        return this.settings.defaultEditor;
    }

    shouldAutoSave() {
        return this.settings.autoSave;
    }

    shouldConfirmDiscard() {
        return this.settings.confirmDiscardChanges;
    }

    isCompactMode() {
        return this.settings.compactMode;
    }

    showAdvancedOptions() {
        return this.settings.showAdvancedOptions;
    }
}

export const settingsManager = new SettingsManager();