import React from 'react';

type WorkflowActionRowProps = {
  children: React.ReactNode;
  ariaLabel?: string;
};

const WorkflowActionRow: React.FC<WorkflowActionRowProps> = ({ children, ariaLabel }) => {
  return (
    <div className="button-group" role="group" aria-label={ariaLabel}>
      {children}
    </div>
  );
};

export default WorkflowActionRow;
