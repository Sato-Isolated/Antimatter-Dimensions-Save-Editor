import type { IconType } from 'react-icons';
import { FaCheckCircle, FaCode, FaLock, FaPaste } from 'react-icons/fa';

export type WorkflowStepId = 'import' | 'validate' | 'edit' | 'export';

export type WorkflowStepDefinition = {
  id: WorkflowStepId;
  index: number;
  title: string;
  summary: string;
  Icon: IconType;
};

export const workflowSteps: WorkflowStepDefinition[] = [
  {
    id: 'import',
    index: 1,
    title: 'Import save',
    summary: 'Decrypt and load',
    Icon: FaPaste,
  },
  {
    id: 'validate',
    index: 2,
    title: 'Validate',
    summary: 'Check integrity',
    Icon: FaCheckCircle,
  },
  {
    id: 'edit',
    index: 3,
    title: 'Edit workspace',
    summary: 'Modify your save',
    Icon: FaCode,
  },
  {
    id: 'export',
    index: 4,
    title: 'Export review',
    summary: 'Encrypt and export',
    Icon: FaLock,
  },
];

export const workflowStepLabelById: Record<WorkflowStepId, string> = {
  import: 'Import save',
  validate: 'Validate',
  edit: 'Edit workspace',
  export: 'Export review',
};
