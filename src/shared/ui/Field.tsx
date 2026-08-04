import React from 'react';
import IssueMessage from './IssueMessage';

interface FieldProps {
  id: string;
  label: string;
  description?: string;
  issue?: string | null;
  children: React.ReactNode;
  className?: string;
}

const Field: React.FC<FieldProps> = ({ id, label, description, issue, children, className }) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const issueId = issue ? `${id}-issue` : undefined;
  const describedBy = [descriptionId, issueId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={['field', className].filter(Boolean).join(' ')}>
      <label htmlFor={id}>{label}</label>
      {description ? <p id={descriptionId} className="field-description">{description}</p> : null}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }>, {
          id,
          'aria-describedby': describedBy,
          'aria-invalid': Boolean(issue),
        })
        : children}
      {issue ? <IssueMessage id={issueId} message={issue} /> : null}
    </div>
  );
};

export default Field;
