import React from 'react';

type WorkflowStepCardProps = {
  step: string;
  title: string;
  summary?: React.ReactNode;
  headerAside?: React.ReactNode;
  children: React.ReactNode;
};

const WorkflowStepCard: React.FC<WorkflowStepCardProps> = ({
  step,
  title,
  summary,
  headerAside,
  children,
}) => {
  return (
    <section className="card workflow-step-card">
      <div className="card-header">
        <div>
          <p className="step-label">{step}</p>
          <h2>{title}</h2>
          {summary ? <p className="section-summary">{summary}</p> : null}
        </div>
        {headerAside}
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
};

export default WorkflowStepCard;
