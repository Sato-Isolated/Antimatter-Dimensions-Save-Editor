import React, { useEffect } from 'react';
import { SaveType } from '../services/SaveService';

interface BigNumberInputProps {
  value: any; // Can be string or {mantissa, exponent} object
  onChange: (value: any) => void;
  saveType: SaveType;
  label?: string;
  className?: string;
}

/**
 * Component for handling big numbers in both PC and Android save formats
 * PC format: string like "1e+1500"
 * Android format: {mantissa: number, exponent: number} object
 */
const BigNumberInput: React.FC<BigNumberInputProps> = ({ 
  value, 
  onChange, 
  saveType, 
  label,
  className = '' 
}) => {
  // Debug logging to identify the source of "[object Object]" error
  useEffect(() => {
    if (value && typeof value === 'object' && !(value.mantissa !== undefined && value.exponent !== undefined)) {
      console.warn('Invalid object value passed to BigNumberInput:', value);
      console.warn('Component stack trace:', new Error().stack);
    }
  }, [value]);

  // Handle PC format (string)
  if (saveType === SaveType.PC) {
    return (
      <div className={`big-number-input pc-format ${className}`}>
        {label && <label className="input-label">{label}</label>}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="input-field"
        />
      </div>
    );
  }
  
  // Handle Android format (object with mantissa and exponent)
  return (
    <div className={`big-number-input android-format ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="android-number-inputs">
        <input
          type="number"
          className="mantissa-input"
          value={value?.mantissa ?? 0}
          onChange={(e) => {
            const newValue = { ...value };
            newValue.mantissa = parseFloat(e.target.value) || 0;
            onChange(newValue);
          }}
          step="0.01"
        />
        <span className="multiply-symbol">×10</span>
        <input
          type="number"
          className="exponent-input"
          value={value?.exponent ?? 0}
          onChange={(e) => {
            const newValue = { ...value };
            newValue.exponent = parseInt(e.target.value) || 0;
            onChange(newValue);
          }}
        />
      </div>
    </div>
  );
};

export default BigNumberInput; 