import React from 'react';

export type StatusChipVariant = 'neutral' | 'success' | 'warning' | 'danger';

type StatusChipProps = {
  variant: StatusChipVariant;
  children: React.ReactNode;
  className?: string;
};

const StatusChip: React.FC<StatusChipProps> = ({ variant, children, className }) => {
  const optionalClassName = className ? ` ${className}` : '';

  return <span className={`status-chip ${variant}${optionalClassName}`}>{children}</span>;
};

export default StatusChip;
