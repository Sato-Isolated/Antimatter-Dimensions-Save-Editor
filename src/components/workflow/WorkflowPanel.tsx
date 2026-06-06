import React from 'react';

type WorkflowPanelProps = {
  step: string;
  title: string;
  summary?: React.ReactNode;
  headerAside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  step,
  title,
  summary,
  headerAside,
  children,
  className,
}) => {
  const optionalClassName = className ? ` ${className}` : '';

  return (
    <section className={`workflow-panel-frame${optionalClassName}`}>
      <div className="workflow-panel-header">
        <div className="workflow-panel-title-group">
          <p className="step-label">{step}</p>
          <h2>{title}</h2>
          {summary ? <p className="section-summary">{summary}</p> : null}
        </div>
        {headerAside ? <div className="workflow-panel-actions">{headerAside}</div> : null}
      </div>
      <div className="workflow-panel-body">{children}</div>
    </section>
  );
};

export default WorkflowPanel;
