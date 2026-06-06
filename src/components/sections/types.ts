import React from 'react';
import { AntimatterDimensionsStruct } from '../../Struct';
import { SaveType } from '../../services/SaveService';
import { SaveDataRecord } from '../../core/save/types';

/**
 * Common props interface for all section components
 */
export interface SectionProps {
  saveData: AntimatterDimensionsStruct | SaveDataRecord;
  handleValueChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
  saveType: SaveType;
} 
