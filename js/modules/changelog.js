class ChangelogModal {
  constructor() {
    this.modalContainer = null;
    this.changelogData = null;
    this.isOpen = false;
    this.activeTab = null;
    this.init();
  }

  async init() {
    await this.loadChangelogData();
    this.createElements();
    this.bindEvents();
  }

  async loadChangelogData() {
    try {
      const response = await fetch('./js/data/changelog.json');
      this.changelogData = await response.json();
    } catch (error) {
      console.error('Error loading changelog:', error);
      this.changelogData = { versions: [], info: [] };
    }
  }

  createElements() {
    // Create modal container
    this.modalContainer = document.createElement('div');
    this.modalContainer.className = 'modal-container';
    this.modalContainer.setAttribute('role', 'dialog');
    this.modalContainer.setAttribute('aria-labelledby', 'modal-title');
    
    // Create HTML content
    this.modalContainer.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-popup">
        ${this.createHeader()}
        ${this.createBody()}
      </div>
    `;

    document.body.appendChild(this.modalContainer);
    
    // Store element references
    this.popup = this.modalContainer.querySelector('.modal-popup');
    this.closeButton = this.modalContainer.querySelector('.modal-close');
  }

  createHeader() {
    const latestVersion = this.changelogData.versions[0]?.version || '0.0.0';
    return `
      <header class="modal-header">
        <div class="title-group">
          <h2 id="modal-title">
            <i class="fas fa-history" aria-hidden="true"></i>
            Changelog
          </h2>
          <span class="version-badge">v${latestVersion}</span>
        </div>
        <button class="modal-close" aria-label="Close">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </header>
    `;
  }

  createBody() {
    return `
      <div class="modal-body">
        ${this.renderInfoMessages()}
        <div class="changelog-tabs">
          <nav class="changelog-nav" role="tablist">
            ${this.renderVersionTabs()}
          </nav>
          <div class="changelog-content">
            ${this.renderVersionPanes()}
          </div>
        </div>
      </div>
    `;
  }

  renderInfoMessages() {
    if (!this.changelogData.info?.length) return '';

    return `
      <div class="info-messages">
        ${this.changelogData.info.map(message => `
          <div class="info-item">
            <i class="fas fa-info-circle" aria-hidden="true"></i>
            <span>${message}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderVersionTabs() {
    if (!this.changelogData.versions?.length) return '';

    return this.changelogData.versions.map((version, index) => `
      <button class="changelog-tab ${index === 0 ? 'active' : ''}"
              id="version-tab-${version.version.replace(/\./g, '-')}"
              role="tab"
              aria-selected="${index === 0}"
              aria-controls="version-pane-${version.version.replace(/\./g, '-')}"
              data-version="${version.version}">
        <span class="version-number">v${version.version}</span>
        <span class="version-date">${new Date(version.date).toLocaleDateString('en-US')}</span>
      </button>
    `).join('');
  }

  renderVersionPanes() {
    if (!this.changelogData.versions?.length) {
      return '<p class="no-changes">No changelog available</p>';
    }

    return this.changelogData.versions.map((version, index) => `
      <div class="changelog-pane ${index === 0 ? 'active' : ''}"
           id="version-pane-${version.version.replace(/\./g, '-')}"
           role="tabpanel"
           aria-labelledby="version-tab-${version.version.replace(/\./g, '-')}">
        ${this.renderCategories(version.categories)}
      </div>
    `).join('');
  }

  renderCategories(categories) {
    if (!categories) return '';

    const categoryConfig = {
      new: { icon: 'fa-star', title: 'New Features' },
      improved: { icon: 'fa-arrow-up', title: 'Improvements' },
      fixed: { icon: 'fa-bug', title: 'Bug Fixes' }
    };

    return `
      <div class="changes-container">
        ${Object.entries(categories).map(([category, changes]) => `
          <section class="change-category ${category}">
            <h4>
              <i class="fas ${categoryConfig[category]?.icon || 'fa-circle'}" aria-hidden="true"></i>
              <span>${categoryConfig[category]?.title || category}</span>
            </h4>
            <ul class="changelog-list">
              ${changes.map(change => `<li>${change}</li>`).join('')}
            </ul>
          </section>
        `).join('')}
      </div>
    `;
  }

  bindEvents() {
    // Open button
    const trigger = document.getElementById('showChangelog');
    trigger?.addEventListener('click', () => this.open());

    // Modal close
    this.closeButton?.addEventListener('click', () => this.close());
    this.modalContainer.querySelector('.modal-overlay')?.addEventListener('click', () => this.close());
    
    // Close with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Tab management
    this.modalContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.changelog-tab');
      if (!tab) return;

      const version = tab.dataset.version;
      this.switchTab(version);
    });

    // Keyboard navigation
    this.modalContainer.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      const tabs = Array.from(this.modalContainer.querySelectorAll('.changelog-tab'));
      const currentTab = document.activeElement;
      
      if (!tabs.includes(currentTab)) return;

      const currentIndex = tabs.indexOf(currentTab);

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          tabs[Math.max(0, currentIndex - 1)]?.focus();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          tabs[Math.min(tabs.length - 1, currentIndex + 1)]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          tabs[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          tabs[tabs.length - 1]?.focus();
          break;
      }
    });
  }

  switchTab(version) {
    const tabs = this.modalContainer.querySelectorAll('.changelog-tab');
    const panes = this.modalContainer.querySelectorAll('.changelog-pane');
    const content = this.modalContainer.querySelector('.changelog-content');
    
    // Disable all panels and tabs
    tabs.forEach(tab => {
      const isActive = tab.dataset.version === version;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    // Hide all panels before showing the new one
    panes.forEach(pane => {
      pane.classList.remove('active');
      pane.style.display = 'none';
    });

    // Show active panel
    const activePane = this.modalContainer.querySelector(`#version-pane-${version.replace(/\./g, '-')}`);
    if (activePane) {
      activePane.style.display = 'block';
      // Wait for next frame to apply transition
      requestAnimationFrame(() => {
        activePane.classList.add('active');
      });
    }

    // Update container height if needed
    if (content && activePane) {
      const paneHeight = activePane.scrollHeight;
      content.style.minHeight = `${paneHeight}px`;
    }

    this.activeTab = version;
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.modalContainer.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    requestAnimationFrame(() => {
      this.modalContainer.classList.add('active');
      this.popup.classList.add('active');
      this.closeButton.focus();
    });
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.popup.classList.remove('active');
    this.modalContainer.classList.remove('active');
    
    setTimeout(() => {
      this.modalContainer.style.display = 'none';
      document.body.classList.remove('modal-open');
    }, 300);
  }
}

export const changelogModal = new ChangelogModal();