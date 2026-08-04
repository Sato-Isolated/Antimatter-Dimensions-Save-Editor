import React from 'react';

export type IssueSeverity = 'error' | 'warning' | 'info';

interface IssueMessageProps {
  id?: string;
  message: string;
  severity?: IssueSeverity;
}

const IssueMessage: React.FC<IssueMessageProps> = ({ id, message, severity = 'error' }) => (
  <p
    id={id}
    className={`field-error-message field-issue-message ${severity}`}
    role={severity === 'error' ? 'alert' : 'status'}
  >
    {message}
  </p>
);

export default IssueMessage;
