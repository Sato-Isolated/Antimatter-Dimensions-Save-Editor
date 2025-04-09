import React from 'react';
import { AntimatterDimensionsStruct } from '../../Struct';
import { SaveType } from '../../services/SaveService';

/**
 * Common props interface for all section components
 */
export interface SectionProps {
  saveData: AntimatterDimensionsStruct;
  handleValueChange: (path: string, value: any) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
  saveType: SaveType;
} 