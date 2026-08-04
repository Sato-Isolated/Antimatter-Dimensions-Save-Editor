import React from 'react';
import { AntimatterDimensionsStruct } from '../../../../Struct';
import { SaveType } from '../../../../domain/save/model';

/**
 * Common props interface for all section components
 */
export interface SectionProps {
  /** Section controls consume a platform-shaped view; the document store remains JSON-typed. */
  saveData: AntimatterDimensionsStruct;
  handleValueChange: (path: string, value: unknown) => void;
  renderValidationIndicator: (path: string) => React.ReactNode;
  saveType: SaveType;
} 
