export function initializeTabs() {
    // S'assurer que seuls les panneaux actifs sont visibles au chargement
    const allPanes = document.querySelectorAll('.tab-pane, .section-pane');
    allPanes.forEach(pane => {
        if (!pane.classList.contains('active')) {
            pane.style.display = 'none';
            pane.style.visibility = 'hidden';
        } else {
            pane.style.display = 'block';
            pane.style.visibility = 'visible';
        }
    });

    // Initialisation des onglets principaux
    const mainTabs = document.querySelectorAll('.tab-button[data-tab]');
    const mainPanes = document.querySelectorAll('.tab-pane');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Désactiver tous les onglets
            mainTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });

            // Activer l'onglet cliqué
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Masquer tous les panneaux avec une transition
            mainPanes.forEach(pane => {
                if (pane.id === `${tab.dataset.tab}-editor`) {
                    pane.style.display = 'block';
                    requestAnimationFrame(() => {
                        pane.classList.add('active');
                        pane.style.visibility = 'visible';
                    });
                } else {
                    pane.classList.remove('active');
                    pane.style.visibility = 'hidden';
                    setTimeout(() => {
                        if (!pane.classList.contains('active')) {
                            pane.style.display = 'none';
                        }
                    }, 300); // Match transition duration
                }
            });
        });
    });

    // Initialisation des sections
    const sectionTabs = document.querySelectorAll('.nav-button[data-section]');
    const sectionPanes = document.querySelectorAll('.section-pane');

    sectionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Désactiver toutes les sections
            sectionTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });

            // Activer la section cliquée
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Gérer les panneaux de section avec une transition
            sectionPanes.forEach(pane => {
                if (pane.id === tab.dataset.section) {
                    pane.style.display = 'block';
                    requestAnimationFrame(() => {
                        pane.classList.add('active');
                        pane.style.visibility = 'visible';
                    });
                } else {
                    pane.classList.remove('active');
                    pane.style.visibility = 'hidden';
                    setTimeout(() => {
                        if (!pane.classList.contains('active')) {
                            pane.style.display = 'none';
                        }
                    }, 300); // Match transition duration
                }
            });
        });
    });

    // Support clavier
    setupKeyboardNavigation(mainTabs, sectionTabs);
}

function setupKeyboardNavigation(mainTabs, sectionTabs) {
    const handleKeyPress = (e, tabs) => {
        const currentTab = document.activeElement;
        if (!tabs.includes(currentTab)) return;

        const currentIndex = Array.from(tabs).indexOf(currentTab);
        let targetIndex;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                targetIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                targetIndex = Math.min(tabs.length - 1, currentIndex + 1);
                break;
            case 'Home':
                e.preventDefault();
                targetIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                targetIndex = tabs.length - 1;
                break;
            default:
                return;
        }

        tabs[targetIndex]?.focus();
        tabs[targetIndex]?.click();
    };

    // Event listeners for keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeMainTab = document.activeElement.closest('.tab-button[data-tab]');
        const activeSectionTab = document.activeElement.closest('.nav-button[data-section]');

        if (activeMainTab) {
            handleKeyPress(e, Array.from(mainTabs));
        } else if (activeSectionTab) {
            handleKeyPress(e, Array.from(sectionTabs));
        }
    });
}