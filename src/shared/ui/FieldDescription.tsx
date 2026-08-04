import React from 'react';

interface FieldDescriptionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

const FieldDescription: React.FC<FieldDescriptionProps> = ({ children, id, className }) => (
  <p id={id} className={['field-description', className].filter(Boolean).join(' ')}>
    {children}
  </p>
);

export default FieldDescription;
