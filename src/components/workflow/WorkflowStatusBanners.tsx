import React from 'react';

type WorkflowStatusBannersProps = {
  errorMessage: string | null;
};

const WorkflowStatusBanners: React.FC<WorkflowStatusBannersProps> = ({
  errorMessage,
}) => {
  return (
    <>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </>
  );
};

export default WorkflowStatusBanners;
