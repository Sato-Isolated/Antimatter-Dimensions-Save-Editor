/**
 * jsonEditor.js
 * Handles the JSON editor functionality
 */

let jsonEditor;
let currentData = null;

export function initJsonEditor() {
  // Create container for JSON editor
  const container = document.getElementById('jsoneditor');
  
  // Initialize JSON editor with options
  const options = {
    mode: 'tree',
    modes: ['code', 'form', 'text', 'tree', 'view'],
    onChangeJSON: onJsonChange,
    onValidationError: onValidationError
  };
  
  // Create JSON editor
  jsonEditor = new JSONEditor(container, options);

  // Listen for settings changes
  document.addEventListener('settingsChanged', (e) => {
    const settings = e.detail;
    if (jsonEditor) {
      // Apply settings that affect the editor's appearance
      if (settings.mode && jsonEditor.mode !== settings.mode) {
        jsonEditor.setMode(settings.mode);
      }
      
      if (settings.autoFormat) {
        const currentValue = jsonEditor.get();
        jsonEditor.set(currentValue);
      }
      
      jsonEditor.refresh();
    }
  });
}

// Handle JSON data changes
function onJsonChange(newData) {
  currentData = newData;
  
  // Trigger an event so other components can react to the change
  const event = new CustomEvent('jsonEditorChanged', { detail: newData });
  document.dispatchEvent(event);
}

// Handle validation errors
function onValidationError(errors) {
  if (errors.length > 0) {
    console.error('JSON validation errors:', errors);
  }
}

// Public methods
export function setJsonEditorData(data) {
  if (jsonEditor) {
    jsonEditor.set(data);
    currentData = data;
  }
}

export function getJsonEditorData() {
  return currentData;
}