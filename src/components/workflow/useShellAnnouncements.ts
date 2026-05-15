import { useEffect, useState } from 'react';

type UseShellAnnouncementsArgs = {
  errorMessage: string | null;
  isLoaded: boolean;
  isDirty: boolean;
  encodedOutputData: string;
  testResults:
    | {
        success: boolean;
        errors: string[];
      }
    | null;
};

type UseShellAnnouncementsResult = {
  statusAnnouncement: string;
  alertAnnouncement: string;
  announceStatus: (message: string) => void;
  announceAlert: (message: string) => void;
  clearAlert: () => void;
};

const INITIAL_STATUS = 'Awaiting encrypted save import.';

export const useShellAnnouncements = ({
  errorMessage,
  isLoaded,
  isDirty,
  encodedOutputData,
  testResults,
}: UseShellAnnouncementsArgs): UseShellAnnouncementsResult => {
  const [statusAnnouncement, setStatusAnnouncement] = useState(INITIAL_STATUS);
  const [alertAnnouncement, setAlertAnnouncement] = useState('');

  useEffect(() => {
    if (errorMessage) {
      setAlertAnnouncement(`Save error: ${errorMessage}`);
      return;
    }

    if (testResults && !testResults.success) {
      setAlertAnnouncement(`Save check found ${testResults.errors.length} issue${testResults.errors.length === 1 ? '' : 's'}.`);
    } else {
      setAlertAnnouncement('');
    }

    if (!isLoaded) {
      setStatusAnnouncement(INITIAL_STATUS);
      return;
    }

    if (testResults?.success) {
      setStatusAnnouncement('Structure test passed for the current document.');
      return;
    }

    if (encodedOutputData) {
      setStatusAnnouncement('Encrypted export is ready to copy.');
      return;
    }

    if (isDirty) {
      setStatusAnnouncement('Edits are stored in memory and ready for export review.');
      return;
    }

    setStatusAnnouncement('Save loaded and ready for editing.');
  }, [encodedOutputData, errorMessage, isDirty, isLoaded, testResults]);

  return {
    statusAnnouncement,
    alertAnnouncement,
    announceStatus: setStatusAnnouncement,
    announceAlert: setAlertAnnouncement,
    clearAlert: () => setAlertAnnouncement(''),
  };
};
