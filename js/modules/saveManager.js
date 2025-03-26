/**
 * saveManager.js
 * Handles save loading, parsing, encrypting/decrypting using gameSaveSerializer.js
 */

import { GameSaveSerializer } from './gameSaveSerializer.js';
import { setJsonEditorData, getJsonEditorData } from './jsonEditor.js';
import { updateStructuredEditorFields } from './structuredEditor.js';

let saveData = null;

export function initSaveManager() {
  // DOM elements
  const inputTextarea = document.getElementById('input');
  const outputTextarea = document.getElementById('output');
  const pasteButton = document.getElementById('pasteButton');
  const decryptButton = document.getElementById('decryptButton');
  const encryptButton = document.getElementById('encryptButton');
  const copyButton = document.getElementById('copyButton');
  
  // Event listeners
  pasteButton.addEventListener('click', handlePaste);
  decryptButton.addEventListener('click', handleDecrypt);
  encryptButton.addEventListener('click', handleEncrypt);
  copyButton.addEventListener('click', handleCopy);
  
  // Listen for JSON editor changes
  document.addEventListener('jsonEditorChanged', (event) => {
    saveData = event.detail;
  });
  
  // Listen for structured editor changes
  document.addEventListener('structuredEditorChanged', (event) => {
    saveData = event.detail;
    setJsonEditorData(saveData);
  });
}

// Paste clipboard content to input textarea
async function handlePaste() {
  try {
    const clipboardText = await navigator.clipboard.readText();
    document.getElementById('input').value = clipboardText;
  } catch (err) {
    console.error('Failed to read clipboard:', err);
    alert('Failed to read from clipboard. Please paste the save manually.');
  }
}

// Decrypt save data
function handleDecrypt() {
  const encryptedData = document.getElementById('input').value.trim();
  
  if (!encryptedData) {
    alert('Please paste an encrypted save first.');
    return;
  }
  
  try {
    // Use imported GameSaveSerializer to decrypt
    const decryptedData = GameSaveSerializer.deserialize(encryptedData);
    saveData = decryptedData;
    
    // Update both editors
    setJsonEditorData(saveData);
    updateStructuredEditorFields(saveData);
    
    // Provide user feedback
    console.log('Save successfully decrypted');
  } catch (error) {
    console.error('Failed to decrypt save:', error);
    alert('Failed to decrypt save. Make sure your save data is valid.');
  }
}

// Encrypt save data
function handleEncrypt() {
  if (!saveData) {
    alert('No save data to encrypt. Please decrypt a save first.');
    return;
  }
  
  try {
    // Get latest data from JSON editor
    const dataToEncrypt = getJsonEditorData();
    
    // Use imported GameSaveSerializer to encrypt
    const encryptedData = GameSaveSerializer.serialize(dataToEncrypt);
    document.getElementById('output').value = encryptedData;
    
    // Provide user feedback
    console.log('Save successfully encrypted');
  } catch (error) {
    console.error('Failed to encrypt save:', error);
    alert('Failed to encrypt save. There might be invalid data in your save.');
  }
}

// Copy encrypted save to clipboard
async function handleCopy() {
  const outputText = document.getElementById('output').value;
  
  if (!outputText) {
    alert('No encrypted save to copy. Please encrypt your save first.');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(outputText);
    console.log('Encrypted save copied to clipboard');
    
    // Provide visual feedback
    const copyButton = document.getElementById('copyButton');
    const originalText = copyButton.innerHTML;
    copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
    
    // Reset button text after 2 seconds
    setTimeout(() => {
      copyButton.innerHTML = originalText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    alert('Failed to copy to clipboard. Please copy the save manually.');
  }
}