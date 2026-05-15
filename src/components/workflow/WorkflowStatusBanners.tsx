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

      <div className="alert alert-info">
        <strong><i className="fa fa-android pulse-subtle" aria-hidden="true"></i> Save support:</strong> PC and Android saves share the same workflow now. Import a save, verify the summary, then choose the structured workspace or JSON editor for deeper edits.
      </div>
    </>
  );
};

export default WorkflowStatusBanners;
