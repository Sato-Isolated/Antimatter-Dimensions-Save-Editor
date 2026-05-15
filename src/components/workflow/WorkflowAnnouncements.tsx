import React from 'react';

type WorkflowAnnouncementsProps = {
  statusMessage: string;
  alertMessage: string;
};

const WorkflowAnnouncements: React.FC<WorkflowAnnouncementsProps> = ({
  statusMessage,
  alertMessage,
}) => {
  return (
    <div className="sr-only workflow-announcements" aria-live="off">
      <div role="status" aria-live="polite" aria-atomic="true">
        {statusMessage}
      </div>
      <div role="alert" aria-atomic="true">
        {alertMessage}
      </div>
    </div>
  );
};

export default WorkflowAnnouncements;
