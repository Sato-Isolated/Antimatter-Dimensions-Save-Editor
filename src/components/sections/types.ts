import React from 'react';
import { AntimatterDimensionsStruct } from '../../Struct/AntimatterDimensionsStruct';

/**
 * Common props interface for all section components
 */
export interface SectionProps {
  saveData: AntimatterDimensionsStruct;
  handleValueChange: (path: string, value: any) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
} 