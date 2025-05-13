import React, { useState, useEffect } from 'react';
import { useSave } from '../contexts/SaveContext';
import 'font-awesome/css/font-awesome.min.css';
import { 
  FaCubes, 
  FaInfinity, 
  FaHourglassEnd, 
  FaSun, 
  FaChartLine,
  FaTrophy,
  FaClone,
  FaExpand,
  FaRobot,
  FaStar,
  FaSlidersH,
  FaHome
} from 'react-icons/fa';
import { 
  GiBlackHoleBolas,
  GiStoneBlock
} from 'react-icons/gi';
import { AntimatterDimensionsStruct } from '../Struct';
import { SaveType } from '../services/SaveService';
import { defaultSaveData } from '../utils/defaultSave';
import { 
  GeneralSection, 
  DimensionsSection,
  ReplicantiSection,
  InfinitySection,
  EternitySection,
  DilationSection,
  RealitySection,
  GlyphsSection,
  CelestialsSection,
  BlackHolesSection,
  ChallengesSection,
  AutoBuyersSection,
  RecordsSection, 
  SettingsSection 
} from './sections';

interface StructuredEditorProps {
  isActive: boolean;
}

// Interface for validation status
interface ValidationStatus {
  path: string;
  isValid: boolean;
  message?: string;
  timestamp: number;
}

/**
 * Structured editor allowing editing specific parts of save data
 */
const StructuredEditor: React.FC<StructuredEditorProps> = ({ isActive }) => {
  const { modifiedSaveData, updateSaveData, isLoaded, saveType } = useSave();
  // State to store validation statuses
  const [validationStatuses, setValidationStatuses] = useState<ValidationStatus[]>([]);
  // State to track the active section (declared only once)
  const [activeSection, setActiveSection] = useState('general');

  // Duration for displaying validation messages (3 seconds)
  const VALIDATION_DISPLAY_DURATION = 3000;

  // Clean up expired validation statuses
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      setValidationStatuses(prev => 
        prev.filter(status => (now - status.timestamp) < VALIDATION_DISPLAY_DURATION)
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Function to validate a value based on its type
  const validateValue = (path: string, value: any): boolean => {
    // If the path is empty, we don't validate (replaces all data)
    if (!path) return true;

    const pathParts = path.split('.');
    const lastPart = pathParts[pathParts.length - 1];

    // For Android format, validate number objects format
    if (saveType === SaveType.Android && typeof value === 'object' && value !== null && 'mantissa' in value && 'exponent' in value) {
      const { mantissa, exponent } = value;
      return (
        typeof mantissa === 'number' && !isNaN(mantissa) &&
        typeof exponent === 'number' && !isNaN(exponent) && Number.isInteger(exponent)
      );
    }

    // For PC format, validate string number format
    if (saveType === SaveType.PC && 
      (lastPart === 'amount' || 
      path === 'antimatter' || 
      path === 'infinityPoints' || 
      path === 'eternityPoints' ||
      path === 'infinityPower' ||
      path.includes('replicanti.amount') ||
      path.includes('dilatedTime') ||
      path.includes('tachyonParticles') ||
      path.includes('realityMachines'))
    ) {
      // Scientific numbers (can contain e, E, ., +, -)
      return /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(value.toString()) || value === "Infinity";
    }

    if (
      lastPart === 'bought' || 
      path === 'infinities' || 
      path === 'eternities' || 
      path === 'realities' ||
      path.includes('galaxies') ||
      path.includes('Bits') ||
      path.includes('slots') ||
      path.includes('Points')
    ) {
      // Integer numbers
      return /^\d+$/.test(value.toString());
    }

    if (lastPart === 'chance') {
      // Probability between 0 and 1
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0 && num <= 1;
    }

    if (lastPart === 'interval') {
      // Interval in ms, must be positive
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }

    // By default, we accept the value
    return true;
  };

  // Handler to update a value with validation
  const handleValueChange = (path: string, value: any) => {
    const isValid = validateValue(path, value);
    
    // Add validation status
    setValidationStatuses(prev => [
      ...prev.filter(status => status.path !== path),
      { 
        path, 
        isValid, 
        message: isValid ? "Valid value" : "Invalid format", 
        timestamp: Date.now() 
      }
    ]);

    // If valid, update the data
    if (isValid) {
      updateSaveData(path, value);
    }
  };

  // Get validation status for a given path
  const getValidationStatus = (path: string): ValidationStatus | undefined => {
    return validationStatuses.find(status => status.path === path);
  };

  // Render a validation indicator
  const renderValidationIndicator = (path: string) => {
    const status = getValidationStatus(path);
    
    if (!status) return null;
    
    return (
      <div className={`validation-indicator ${status.isValid ? 'valid' : 'invalid'}`}>
        {status.isValid ? (
          <i className="fa fa-check-circle" title="Valid value"></i>
        ) : (
          <i className="fa fa-times-circle" title="Invalid format"></i>
        )}
      </div>
    );
  };

  // Organizing tabs in a logical order based on game progression and related features
  const tabs = [
    // Core game mechanics
    { id: 'general', label: 'Main Resources', icon: <FaHome />, render: () => <GeneralSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'dimensions', label: 'Dimensions', icon: <FaCubes />, render: () => <DimensionsSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    
    // Prestige mechanics (in order of progression)
    { id: 'infinity', label: 'Infinity', icon: <FaInfinity />, render: () => <InfinitySection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'replicanti', label: 'Replicanti', icon: <FaClone />, render: () => <ReplicantiSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'eternity', label: 'Eternity', icon: <FaHourglassEnd />, render: () => <EternitySection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'dilation', label: 'Dilation', icon: <FaExpand />, render: () => <DilationSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'reality', label: 'Reality', icon: <FaSun />, render: () => <RealitySection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'glyphs', label: 'Glyphs', icon: <GiStoneBlock />, render: () => <GlyphsSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    
    // Advanced game mechanics
    { id: 'celestials', label: 'Celestials', icon: <FaStar />, render: () => <CelestialsSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'black-holes', label: 'Black Holes', icon: <GiBlackHoleBolas />, render: () => <BlackHolesSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'challenges', label: 'Challenges', icon: <FaTrophy />, render: () => <ChallengesSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    
    // Automation and records
    { id: 'autobuyers', label: 'Auto Buyers', icon: <FaRobot />, render: () => <AutoBuyersSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    { id: 'records', label: 'Records & Stats', icon: <FaChartLine />, render: () => <RecordsSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> },
    
    // Settings
    { id: 'settings', label: 'Settings', icon: <FaSlidersH />, render: () => <SettingsSection saveData={modifiedSaveData || defaultSaveData as AntimatterDimensionsStruct} handleValueChange={handleValueChange} renderValidationIndicator={renderValidationIndicator} saveType={saveType} /> }
  ];

  // Tab click handling
  const handleTabClick = (tabId: string) => {
    setActiveSection(tabId);
  };

  // Subtab click handling
  const handleSubtabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const subtabId = e.currentTarget.getAttribute('data-subtab');
    if (!subtabId) return;
    
    // DOM update to show the active tab
    const container = e.currentTarget.closest('.tabs-container');
    if (container) {
      // Update buttons
      const buttons = container.querySelectorAll('.tab-button');
      buttons.forEach(button => button.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      // Update content
      const contents = container.querySelectorAll('.tab-pane');
      contents.forEach(content => {
        if (content instanceof HTMLElement) {
          content.style.display = 'none';
          content.classList.remove('active');
        }
      });
      
      const activeContent = container.querySelector(`.tab-pane[data-subtab="${subtabId}"]`);
      if (activeContent instanceof HTMLElement) {
        activeContent.style.display = 'block';
        activeContent.classList.add('active');
      }
    }
  };

  // After initial render, connect event handlers
  useEffect(() => {
    const tabButtons = document.querySelectorAll('.tab-button[data-subtab]');
    tabButtons.forEach(button => {
      button.addEventListener('click', handleSubtabClick as unknown as EventListener);
    });
    
    return () => {
      tabButtons.forEach(button => {
        button.removeEventListener('click', handleSubtabClick as unknown as EventListener);
      });
    };
  }, [activeSection]);

  // Rendu du contenu en fonction de la section active
  const renderActiveSection = () => {
    const activeTab = tabs.find(tab => tab.id === activeSection);
    return activeTab ? activeTab.render() : null;
  };

  return (
    <div className="structured-editor" style={{ display: isActive ? 'block' : 'none' }}>
      {/* Navigation */}
      <div className="editor-sections">
        <nav className="section-nav" role="tablist" aria-label="Editor sections">
          {/* Navigation buttons */}
          {tabs.map(section => (
            <button
              key={section.id}
              className={`section-button ${activeSection === section.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeSection === section.id}
              aria-controls={`section-${section.id}`}
              onClick={() => handleTabClick(section.id)}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Contenu principal */}
        <div className="section-content">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

// Exporter le composant avec export default
export default StructuredEditor; 