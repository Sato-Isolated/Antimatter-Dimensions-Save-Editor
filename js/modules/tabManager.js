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
        // Initialize based on user settings
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

            // Ajouter le support des touches
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
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

            // Ajouter le support des touches
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    initHistory() {
        // Gérer la navigation avec l'historique du navigateur
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
                pane.classList.add('active');
                pane.removeAttribute('hidden');

                // Update UI if switching to settings
                if (targetId === 'settings') {
                    settingsManager.updateUI();
                }
            } else {
                pane.classList.remove('active');
                pane.setAttribute('hidden', '');
            }
        });

        // Update history
        const state = { tab: targetId };
        history.pushState(state, '', `#${targetId}`);
    }

    switchSectionTab(targetId, clickedButton, allButtons, allPanes) {
        // Mettre à jour les classes actives
        allButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        clickedButton.classList.add('active');
        clickedButton.setAttribute('aria-selected', 'true');

        // Mettre à jour les panneaux avec animation
        allPanes.forEach(pane => {
            if (pane.id === targetId) {
                // Appliquer l'animation d'entrée
                pane.style.display = 'block';
                requestAnimationFrame(() => {
                    pane.classList.add('active');
                });
            } else {
                // Appliquer l'animation de sortie
                pane.classList.remove('active');
                pane.addEventListener('transitionend', () => {
                    if (!pane.classList.contains('active')) {
                        pane.style.display = 'none';
                    }
                }, { once: true });
            }
        });

        // Mettre à jour l'historique
        const state = { 
            tab: document.querySelector('.tab-button.active').dataset.tab,
            section: targetId 
        };
        history.pushState(state, '', `#${state.tab}/${targetId}`);
    }

    switchToTab(tab, section = null) {
        // Trouver et activer l'onglet principal
        const tabButton = document.querySelector(`.tab-button[data-tab="${tab}"]`);
        if (tabButton) {
            tabButton.click();
        }

        // Si une section est spécifiée, l'activer
        if (section) {
            const sectionButton = document.querySelector(`.nav-button[data-section="${section}"]`);
            if (sectionButton) {
                sectionButton.click();
            }
        }
    }

    // Méthode pour restaurer l'état des onglets depuis l'URL
    restoreFromUrl() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const [tab, section] = hash.split('/');
            this.switchToTab(tab, section);
        }
    }
}

// Singleton instance
let tabManagerInstance = null;

// Initialization function
export function initTabManager() {
    const tabsContainer = document.querySelector('.tabs[role="tablist"]');
    
    if (!tabsContainer) return;

    // If no tab is active, set the default tab based on settings
    const activeTab = tabsContainer.querySelector('.tab-button.active');
    if (!activeTab) {
        const defaultTab = tabsContainer.querySelector(`#${settingsManager.getDefaultEditor()}-tab`);
        if (defaultTab) {
            activateTab(defaultTab);
        }
    }

    tabsContainer.addEventListener('click', handleTabClick);
}

function handleTabClick(event) {
    const tabButton = event.target.closest('.tab-button');
    if (!tabButton) return;
    
    activateTab(tabButton);
}

function activateTab(selectedTab) {
    const container = selectedTab.closest('.tabs');
    const tabGroup = container.getAttribute('aria-label');
    
    // Deactivate all tabs
    container.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    // Hide all tab panels
    const allPanes = document.querySelectorAll('.tab-pane');
    allPanes.forEach(pane => pane.classList.remove('active'));
    
    // Activate selected tab
    selectedTab.classList.add('active');
    selectedTab.setAttribute('aria-selected', 'true');
    
    // Show selected panel
    const panelId = selectedTab.getAttribute('aria-controls');
    const selectedPane = document.getElementById(panelId);
    if (selectedPane) {
        selectedPane.classList.add('active');
    }

    // If switching to settings tab, update the UI
    if (selectedTab.id === 'settings-tab') {
        settingsManager.updateUI();
    }
}

export function switchToTab(tabId) {
    const tab = document.getElementById(tabId);
    if (tab) {
        activateTab(tab);
    }
}