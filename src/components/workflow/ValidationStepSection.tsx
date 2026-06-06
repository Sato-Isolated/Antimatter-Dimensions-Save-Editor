import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import {
  SaveDocumentSnapshot,
  SaveTestResults,
  SaveValidationIssue,
} from '../../core/save/types';
import ValidationSummarySection from './ValidationSummarySection';
import WorkflowStepCard from './WorkflowStepCard';

type ValidationStepSectionProps = {
  isLoaded: boolean;
  document: SaveDocumentSnapshot | null;
  validationIssues: SaveValidationIssue[];
  validationErrorCount: number;
  validationWarningCount: number;
  testResults: SaveTestResults | null;
  formattedLastChange: string;
  onRunStructureTest: () => void;
  runStructureTestButtonRef: React.RefObject<HTMLButtonElement | null>;
};

const ValidationStepSection: React.FC<ValidationStepSectionProps> = ({
  isLoaded,
  document,
  validationIssues,
  validationErrorCount,
  validationWarningCount,
  testResults,
  formattedLastChange,
  onRunStructureTest,
  runStructureTestButtonRef,
}) => {
  return (
    <WorkflowStepCard
      step="Step 2"
      title="Validation summary"
      headerAside={(
        <button
          ref={runStructureTestButtonRef}
          className="btn secondary"
          onClick={onRunStructureTest}
          disabled={!isLoaded}
        >
          <FaCheckCircle aria-hidden="true" /> Run structure test
        </button>
      )}
    >
      <ValidationSummarySection
        isLoaded={isLoaded}
        document={document}
        validationIssues={validationIssues}
        validationErrorCount={validationErrorCount}
        validationWarningCount={validationWarningCount}
        testResults={testResults}
        formattedLastChange={formattedLastChange}
      />
    </WorkflowStepCard>
  );
};

export default ValidationStepSection;
