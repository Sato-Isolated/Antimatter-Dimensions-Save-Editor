import React, { useState, useRef } from 'react';
import { useSave } from '../contexts/SaveContext';
import { SaveType } from '../services/SaveService';
// CSS import removed - now using SCSS via main.scss

const SaveImport: React.FC = () => {
  const { setRawSaveData, decryptSave, rawSaveData, isLoaded, errorMessage, saveType } = useSave();
  const [isDragging, setIsDragging] = useState(false);
  const [importMethod, setImportMethod] = useState<'paste' | 'file'>('paste');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for text area changes (pasting save)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawSaveData(e.target.value);
  };

  // Handler for file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRawSaveData(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  // Handler for file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRawSaveData(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  // Handler for triggering file input
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Drag event handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="save-import-container">
      <h2>Import Save File</h2>
      
      <div className="import-method-selector">
        <button 
          className={`method-button ${importMethod === 'paste' ? 'active' : ''}`}
          onClick={() => setImportMethod('paste')}
        >
          Paste Save
        </button>
        <button 
          className={`method-button ${importMethod === 'file' ? 'active' : ''}`}
          onClick={() => setImportMethod('file')}
        >
          Upload File
        </button>
      </div>
      
      {importMethod === 'paste' && (
        <div className="paste-container">
          <textarea
            className="save-text-input"
            placeholder="Paste your save data here..."
            value={rawSaveData}
            onChange={handleTextChange}
          />
        </div>
      )}
      
      {importMethod === 'file' && (
        <div 
          className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileInputClick}
        >
          <div className="drop-zone-content">
            <i className="fa fa-upload"></i>
            <p>Click to select or drag & drop your save file here</p>
            <p className="file-format-note">Accepts .txt save files</p>
          </div>
          <input 
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept=".txt"
            onChange={handleFileChange}
          />
        </div>
      )}
      
      <button 
        className="decrypt-button" 
        onClick={decryptSave}
        disabled={!rawSaveData.trim()}
      >
        Decrypt Save
      </button>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {isLoaded && (
        <div className="success-message">
          <i className="fa fa-check-circle"></i>
          <span>Save loaded successfully!</span>
          <div className="save-type-indicator">
            Format detected: {saveType === SaveType.Android ? 'Android' : 'PC'}
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveImport; 