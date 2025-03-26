/**
 * themeManager.js
 * Handles theme switching functionality (dark/light)
 */

export class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.initTheme();
        this.initThemeToggle();
        this.updateTabStyles();
    }

    initTheme() {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${this.currentTheme}-theme`);
    }

    initThemeToggle() {
        const toggleButton = document.getElementById('toggleTheme');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.currentTheme);
        this.initTheme();
        this.updateTabStyles();
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = document.querySelector('#toggleTheme i');
        if (icon) {
            icon.className = this.currentTheme === 'dark' 
                ? 'fas fa-sun'
                : 'fas fa-moon';
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
        const style = getComputedStyle(document.body);
        return {
            primary: style.getPropertyValue('--primary-color'),
            cardBg: style.getPropertyValue('--card-bg'),
            textColor: style.getPropertyValue('--text-color'),
            borderColor: style.getPropertyValue('--border-color')
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