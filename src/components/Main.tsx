import React, { useState, useEffect } from 'react';
import { useSave } from '../contexts/SaveContext';
import JsonEditor from './JsonEditor';
import StructuredEditor from './StructuredEditor';
import 'font-awesome/css/font-awesome.min.css';
import ThemeSelector from './ThemeSelector';
import changelogData from '../data/changelog.json';

// Define the Window interface extension to include changelogData
declare global {
  interface Window {
    changelogData?: {
      versions: Array<{
        version: string;
        date: string;
        categories: {
          [key: string]: string[];
        };
      }>;
      info: string[];
    };
  }
}

const Main: React.FC = () => {
  // Tab types
  type TabType = 'structured' | 'json' | 'settings' | 'changelog';
  
  // State to track active tab
  const [activeTab, setActiveTab] = useState<TabType>('structured');
  
  // Load changelog data
  useEffect(() => {
    // Set the changelog data directly
    window.changelogData = changelogData;
  }, []);
  
  // Get save context
  const { 
    rawSaveData, 
    setRawSaveData, 
    decryptSave, 
    encryptSave, 
    encodedOutputData,
    errorMessage
  } = useSave();
  
  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  // Handle paste button click
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRawSaveData(text);
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
    }
  };
  
  // Handle decrypt button click
  const handleDecrypt = () => {
    decryptSave();
  };
  
  // Handle encrypt button click
  const handleEncrypt = () => {
    encryptSave();
  };
  
  // Handle copy button click
  const handleCopy = async () => {
    try {
      if (encodedOutputData) {
        await navigator.clipboard.writeText(encodedOutputData);
        console.log('Copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };
  
  const renderChangelogContent = () => {
    const changelogData = window.changelogData || { versions: [], info: [] };
    
    if (!changelogData.versions || changelogData.versions.length === 0) {
      return <p className="no-changes">No changelog available</p>;
    }

    return (
      <>
        {changelogData.info && changelogData.info.length > 0 && (
          <div className="info-banner">
            {changelogData.info.map((message, idx) => (
              <div className="info-item" key={idx}>
                <i className="fa fa-info-circle pulse-subtle" aria-hidden="true"></i>
                <span>{message}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="changelog-list-view">
          {changelogData.versions.map((version, vIdx) => (
            <div className="version-entry" key={vIdx} data-version={version.version}>
              <div className="version-header">
                <div className="version-badge">v{version.version}</div>
                <div className="version-date">
                  <i className="fa fa-calendar-o" aria-hidden="true"></i>
                  {new Date(version.date).toLocaleDateString()}
                </div>
              </div>
              
              <div className="version-content">
                {version.categories && Object.entries(version.categories)
                  .filter(([_, changes]) => changes.length > 0)
                  .map(([category, changes], cIdx) => {
                    const categoryConfig = {
                      new: { 
                        icon: 'fa-star',
                        title: 'New Features',
                        color: 'success',
                        emoji: '✨'
                      },
                      improved: { 
                        icon: 'fa-arrow-up',
                        title: 'Improvements',
                        color: 'primary',
                        emoji: '🔄'
                      },
                      fixed: { 
                        icon: 'fa-bug',
                        title: 'Bug Fixes',
                        color: 'warning',
                        emoji: '🐞'
                      }
                    };
                    
                    const config = categoryConfig[category] || {
                      icon: 'fa-info',
                      title: 'Changes',
                      color: 'info',
                      emoji: 'ℹ️'
                    };
                    
                    return (
                      <div className={`category-section ${category}`} key={cIdx}>
                        <div className={`category-header ${config.color}`}>
                          <i className={`fa ${config.icon}`} aria-hidden="true"></i>
                          <h4>{config.title}</h4>
                          <span className="change-count">{changes.length}</span>
                        </div>
                        <ul className="changes-list">
                          {changes.map((change, idx) => (
                            <li key={idx}>
                              <span className="change-bullet">{config.emoji}</span>
                              <div className="change-content">
                                <span className="change-index">{idx+1}</span>
                                <span className="change-text">{change}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  return (
    <div className="editor-container">
      <div className="main-content">
        {errorMessage && (
          <div className="alert alert-danger">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
        
        {/* Import Save Section */}
        <div className="card">
          <div className="card-header">
            <h2>Import Save</h2>
          </div>
          <div className="card-body">
            <div className="input-group">
              <textarea
                id="input"
                className="save-textarea"
                placeholder="Paste your encrypted save data here..."
                aria-label="Save data input"
                spellCheck="false"
                value={rawSaveData}
                onChange={(e) => setRawSaveData(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button id="pasteButton" className="btn primary" onClick={handlePaste}>
                <i className="fa fa-paste"></i> Paste
              </button>
              <button id="decryptButton" className="btn secondary" onClick={handleDecrypt}>
                <i className="fa fa-unlock"></i> Decrypt
              </button>
            </div>
          </div>
        </div>
        
        {/* Editor Tabs */}
        <div className="card">
          {/* Main tabs */}
          <div className="card-header with-tabs">
            <div className="tabs main-tabs" role="tablist" aria-label="Editor modes">
              <button 
                className={`tab-button ${activeTab === 'structured' ? 'active' : ''}`}
                id="structured-tab"
                data-tab="structured"
                role="tab"
                aria-controls="structured-editor"
                aria-selected={activeTab === 'structured'}
                onClick={() => handleTabChange('structured')}
              >
                <i className="fa fa-th-large" aria-hidden="true"></i>
                <span>Structured Editor</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'json' ? 'active' : ''}`}
                id="json-tab"
                data-tab="json"
                role="tab"
                aria-controls="json-editor"
                aria-selected={activeTab === 'json'}
                onClick={() => handleTabChange('json')}
              >
                <i className="fa fa-code" aria-hidden="true"></i>
                <span>JSON Editor</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                id="settings-tab"
                data-tab="settings"
                role="tab"
                aria-controls="settings-editor"
                aria-selected={activeTab === 'settings'}
                onClick={() => handleTabChange('settings')}
              >
                <i className="fa fa-cog" aria-hidden="true"></i>
                <span>Settings</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'changelog' ? 'active' : ''}`}
                id="changelog-tab"
                data-tab="changelog"
                role="tab"
                aria-controls="changelog-editor"
                aria-selected={activeTab === 'changelog'}
                onClick={() => handleTabChange('changelog')}
              >
                <i className="fa fa-history" aria-hidden="true"></i>
                <span>Changelog</span>
              </button>
            </div>
          </div>

          <div className="card-body">
            <div className="tab-content">
              {/* Structured editor */}
              <div 
                className={`tab-pane ${activeTab === 'structured' ? 'active' : ''}`}
                id="structured-editor"
                role="tabpanel"
                aria-labelledby="structured-tab"
              >
                <StructuredEditor isActive={activeTab === 'structured'} />
              </div>
              
              {/* JSON Editor */}
              <div 
                className={`tab-pane ${activeTab === 'json' ? 'active' : ''}`}
                id="json-editor"
                role="tabpanel"
                aria-labelledby="json-tab"
              >
                <JsonEditor isActive={activeTab === 'json'} />
              </div>
              
              {/* Settings */}
              <div 
                className={`tab-pane ${activeTab === 'settings' ? 'active' : ''}`}
                id="settings-editor"
                role="tabpanel"
                aria-labelledby="settings-tab"
              >
                <div className="settings-layout">
                  <h3>Editor Preferences</h3>
                  
                  <div className="settings-section-divider">
                    <span className="divider-title">App Theme</span>
                  </div>
                  
                  <div className="theme-settings-container">
                    <ThemeSelector />
                  </div>
                  
                  <div className="settings-section-divider">
                    <span className="divider-title">Editor Options</span>
                  </div>
                  
                  <div className="settings-group">
                    <h4>Default View</h4>
                    <div className="input-group">
                      <label>
                        <input type="radio" name="defaultEditor" value="structured" defaultChecked />
                        <span className="radio-label">Start with Structured Editor</span>
                      </label>
                      <label>
                        <input type="radio" name="defaultEditor" value="json" />
                        <span className="radio-label">Start with JSON Editor</span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-group">
                    <h4>JSON Editor Settings</h4>
                    <div className="input-group">
                      <label>
                        <input type="checkbox" name="autoFormat" defaultChecked />
                        <span className="checkbox-label">Auto-format JSON</span>
                      </label>
                      <label>
                        <input type="checkbox" name="showErrors" defaultChecked />
                        <span className="checkbox-label">Show validation errors</span>
                      </label>
                    </div>
                  </div>

                  <button className="btn danger">Reset All Settings</button>
                </div>
              </div>

              {/* Changelog */}
              <div 
                className={`tab-pane ${activeTab === 'changelog' ? 'active' : ''}`}
                id="changelog-editor"
                role="tabpanel"
                aria-labelledby="changelog-tab"
              >
                <div className="changelog-container">
                  {renderChangelogContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Export Save Section */}
        <div className="card">
          <div className="card-header">
            <h2>Export Save</h2>
          </div>
          <div className="card-body">
            <div className="input-group">
              <textarea
                id="output"
                className="save-textarea"
                placeholder="Your encrypted save will appear here..."
                aria-label="Save data output"
                spellCheck="false"
                readOnly
                value={encodedOutputData}
              />
            </div>
            <div className="button-group">
              <button id="encryptButton" className="btn primary" onClick={handleEncrypt}>
                <i className="fa fa-lock"></i> Encrypt
              </button>
              <button id="copyButton" className="btn secondary" onClick={handleCopy}>
                <i className="fa fa-copy"></i> Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main; 