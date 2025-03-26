/**
 * ui.js
 * Handles general UI interactions and utilities
 */

export function initUI() {
  // Setup copy/paste buttons functionality
  setupCopyPasteButtons();
  
  // Add event listeners for any UI components that need interactivity
  setupUIInteractions();
}

// Setup the copy and paste buttons
function setupCopyPasteButtons() {
  const copyButton = document.getElementById('copyButton');
  const pasteButton = document.getElementById('pasteButton');
  
  // Copy button logic is handled in saveManager.js
  
  // Paste button fallback (in case the Clipboard API is not available)
  if (pasteButton) {
    pasteButton.addEventListener('click', function() {
      if (!navigator.clipboard) {
        alert('Clipboard access is not available in your browser. Please paste the save manually.');
      }
    });
  }
}

// Setup any UI interactions
function setupUIInteractions() {
  // Add animations for buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mousedown', function() {
      this.classList.add('button-active');
    });
    
    button.addEventListener('mouseup', function() {
      this.classList.remove('button-active');
    });
    
    button.addEventListener('mouseleave', function() {
      this.classList.remove('button-active');
    });
  });
  
  // Add support for showing/hiding info panels
  const infoToggles = document.querySelectorAll('.info-toggle');
  infoToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.dataset.target;
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) {
          target.classList.toggle('expanded');
          this.classList.toggle('active');
        }
      }
    });
  });
}

// Show a notification message
export function showNotification(message, type = 'info', duration = 3000) {
  // Create notification element if it doesn't exist
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set message and type
  notification.textContent = message;
  notification.className = `notification ${type}`;
  
  // Show the notification
  notification.classList.add('show');
  
  // Hide after duration
  setTimeout(() => {
    notification.classList.remove('show');
  }, duration);
}

// Format large numbers with scientific notation
export function formatNumber(num) {
  if (typeof num !== 'number' && typeof num !== 'string') {
    return '0';
  }
  
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numValue)) {
    return '0';
  }
  
  if (numValue < 1e6) {
    return numValue.toLocaleString();
  }
  
  return numValue.toExponential(2);
}