import { settingsManager } from './settings.js';

/**
 * tabManager.js
 * Handles the tab system for switching between structured editor and JSON editor
 */

export class TabManager {
    constructor() {
        this.init();
    }

    init() {
        this.initMainTabs();
        this.initSectionTabs();
        this.initHistory();
        
        // Apply default tab from settings
        const defaultTab = settingsManager.getDefaultEditor();
        if (!document.querySelector('.tab-button.active')) {
            this.switchToTab(defaultTab);
        }
    }

    initMainTabs() {
        const tabButtons = document.querySelectorAll('.tab-button[data-tab]');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.dataset.tab;
                this.switchMainTab(targetId, button, tabButtons, tabPanes);
            });
        });
    }

    initSectionTabs() {
        const sectionButtons = document.querySelectorAll('.nav-button[data-section]');
        const sectionPanes = document.querySelectorAll('.section-pane');

        sectionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.dataset.section;
                this.switchSectionTab(targetId, button, sectionButtons, sectionPanes);
            });
        });
    }

    initHistory() {
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.tab) {
                const { tab, section } = e.state;
                this.switchToTab(tab, section);
            }
        });
    }

    switchMainTab(targetId, clickedButton, allButtons, allPanes) {
        // Update button states
        allButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        clickedButton.classList.add('active');
        clickedButton.setAttribute('aria-selected', 'true');

        // Update panes with transition
        allPanes.forEach(pane => {
            if (pane.id === `${targetId}-editor`) {
                // Show the panel
                pane.style.display = 'block';
                pane.style.visibility = 'visible';
                pane.classList.add('active');
                pane.removeAttribute('hidden');

                // Update UI if switching to settings
                if (targetId === 'settings') {
                    settingsManager.updateUI();
                }
            } else {
                // Hide the panel
                pane.classList.remove('active');
                pane.style.visibility = 'hidden';
                pane.style.display = 'none';
                pane.setAttribute('hidden', '');
            }
        });

        // Update history
        const state = { tab: targetId };
        history.pushState(state, '', `#${targetId}`);
    }

    switchSectionTab(targetId, clickedButton, allButtons, allPanes) {
        // Update button states
        allButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        clickedButton.classList.add('active');
        clickedButton.setAttribute('aria-selected', 'true');

        // Update panes with transition
        allPanes.forEach(pane => {
            if (pane.id === targetId) {
                // Show the panel
                pane.style.display = 'block';
                pane.style.visibility = 'visible';
                pane.classList.add('active');
            } else {
                // Hide the panel
                pane.classList.remove('active');
                pane.style.visibility = 'hidden';
                pane.style.display = 'none';
            }
        });

        // Update history
        const state = { 
            tab: document.querySelector('.tab-button.active').dataset.tab,
            section: targetId 
        };
        history.pushState(state, '', `#${state.tab}/${targetId}`);
    }

    switchToTab(tab, section = null) {
        // Switch main tab
        const tabButton = document.querySelector(`.tab-button[data-tab="${tab}"]`);
        if (tabButton) {
            const tabButtons = document.querySelectorAll('.tab-button[data-tab]');
            const tabPanes = document.querySelectorAll('.tab-pane');
            this.switchMainTab(tab, tabButton, tabButtons, tabPanes);
        }

        // Switch section if specified
        if (section) {
            const sectionButton = document.querySelector(`.nav-button[data-section="${section}"]`);
            if (sectionButton) {
                const sectionButtons = document.querySelectorAll('.nav-button[data-section]');
                const sectionPanes = document.querySelectorAll('.section-pane');
                this.switchSectionTab(section, sectionButton, sectionButtons, sectionPanes);
            }
        }
    }
}

export const tabManager = new TabManager();