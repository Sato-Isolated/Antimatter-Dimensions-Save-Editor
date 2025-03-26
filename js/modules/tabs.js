export function initializeTabs() {
    // S'assurer que seuls les panneaux actifs sont visibles au chargement
    const allPanes = document.querySelectorAll('.tab-pane, .section-pane');
    allPanes.forEach(pane => {
        if (!pane.classList.contains('active')) {
            pane.style.display = 'none';
            pane.style.visibility = 'hidden';
            pane.style.opacity = '0';
            pane.style.pointerEvents = 'none';
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

            // Masquer tous les panneaux
            mainPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.style.display = 'none';
                pane.style.visibility = 'hidden';
                pane.style.opacity = '0';
                pane.style.pointerEvents = 'none';
            });

            // Afficher le panneau correspondant
            const targetPane = document.getElementById(`${tab.dataset.tab}-editor`);
            if (targetPane) {
                targetPane.classList.add('active');
                targetPane.style.display = 'block';
                targetPane.style.visibility = 'visible';
                targetPane.style.opacity = '1';
                targetPane.style.pointerEvents = 'auto';
            }
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

            // Masquer tous les panneaux de section
            sectionPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.style.display = 'none';
                pane.style.visibility = 'hidden';
                pane.style.opacity = '0';
                pane.style.pointerEvents = 'none';
            });

            // Afficher le panneau de section correspondant
            const targetPane = document.getElementById(tab.dataset.section);
            if (targetPane) {
                targetPane.classList.add('active');
                targetPane.style.display = 'block';
                targetPane.style.visibility = 'visible';
                targetPane.style.opacity = '1';
                targetPane.style.pointerEvents = 'auto';
            }
        });
    });
}