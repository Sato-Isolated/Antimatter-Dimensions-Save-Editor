/**
 * themeManager.js
 * Handles theme switching functionality (dark/light)
 */

export class ThemeManager {
    constructor() {
        this.themes = {
            light: 'Light',
            dark: 'Dark',
            antimatter: 'Antimatter',
            infinity: 'Infinity',
            eternity: 'Eternity',
            reality: 'Reality'
        };
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.initTheme();
        this.initThemeToggle();
        this.setupThemeMenu();
    }

    initTheme() {
        // Retirer toutes les classes de thème
        Object.keys(this.themes).forEach(theme => {
            document.body.classList.remove(`${theme}-theme`);
        });
        
        // Appliquer le thème actuel
        document.body.classList.add(`${this.currentTheme}-theme`);
        
        // Mettre à jour les attributs data pour CSS
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Déclencher une animation de transition
        document.body.style.animation = 'theme-transition 0.3s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }

    initThemeToggle() {
        const themeSelect = document.createElement('select');
        themeSelect.id = 'themeSelect';
        themeSelect.className = 'theme-select';
        
        Object.entries(this.themes).forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            themeSelect.appendChild(option);
        });
        
        themeSelect.value = this.currentTheme;
        
        themeSelect.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
        
        const themeToggle = document.getElementById('toggleTheme');
        if (themeToggle) {
            themeToggle.parentNode.replaceChild(themeSelect, themeToggle);
        }
    }

    setTheme(theme) {
        if (this.themes[theme]) {
            this.currentTheme = theme;
            localStorage.setItem('theme', theme);
            this.initTheme();
            document.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme: theme }
            }));
        }
    }

    setupThemeMenu() {
        // Créer un menu de thème plus élaboré dans les paramètres
        const settingsThemeGroup = document.querySelector('.settings-group[data-settings="theme"]');
        if (settingsThemeGroup) {
            const themeOptions = settingsThemeGroup.querySelector('.theme-options');
            if (themeOptions) {
                themeOptions.innerHTML = '';
                Object.entries(this.themes).forEach(([value, label]) => {
                    const themeOption = document.createElement('div');
                    themeOption.className = 'theme-option';
                    themeOption.innerHTML = `
                        <input type="radio" name="theme" id="theme-${value}" value="${value}"
                            ${this.currentTheme === value ? 'checked' : ''}>
                        <label for="theme-${value}">
                            <span class="theme-preview ${value}-preview"></span>
                            <span class="theme-name">${label}</span>
                        </label>
                    `;
                    themeOptions.appendChild(themeOption);
                });

                themeOptions.addEventListener('change', (e) => {
                    if (e.target.type === 'radio') {
                        this.setTheme(e.target.value);
                    }
                });
            }
        }
    }

    // Mise à jour spécifique des styles d'onglets
    updateTabStyles() {
        // Mettre à jour les couleurs de bordure actives
        const activeTabIndicator = document.querySelector('.tab-button.active');
        if (activeTabIndicator) {
            // Forcer le recalcul des transitions
            activeTabIndicator.style.transition = 'none';
            activeTabIndicator.offsetHeight; // Forcer le repaint
            activeTabIndicator.style.transition = '';
        }

        // Mettre à jour les sections actives
        const activeSectionTab = document.querySelector('.nav-button.active');
        if (activeSectionTab) {
            // Forcer le recalcul des transitions
            activeSectionTab.style.transition = 'none';
            activeSectionTab.offsetHeight; // Forcer le repaint
            activeSectionTab.style.transition = '';
        }
    }

    // Utilitaire pour obtenir les couleurs du thème actuel
    getThemeColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            primary: style.getPropertyValue('--primary-color').trim(),
            background: style.getPropertyValue('--bg-color').trim(),
            text: style.getPropertyValue('--text-color').trim(),
            border: style.getPropertyValue('--border-color').trim(),
            accent: style.getPropertyValue('--accent-color').trim()
        };
    }
}

// Singleton instance
let themeManagerInstance = null;

// Initialization function
export function initThemeManager() {
    if (!themeManagerInstance) {
        themeManagerInstance = new ThemeManager();
    }
    return themeManagerInstance;
}