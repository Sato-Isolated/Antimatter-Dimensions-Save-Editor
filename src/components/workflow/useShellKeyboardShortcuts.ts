import { useEffect } from 'react';

type UseShellKeyboardShortcutsArgs = {
  onPaste: () => void | Promise<void>;
  onDecrypt: () => void;
  onRunStructureTest: () => void;
  onEncrypt: () => void;
  onCopy: () => void | Promise<void>;
  canRunStructureTest: boolean;
  canEncrypt: boolean;
  canCopy: boolean;
  focusCurrentWorkspaceTab: () => void;
  focusImportInput: () => void;
  focusRunValidationButton: () => void;
  focusExportOutput: () => void;
  focusEncryptButton: () => void;
  focusCopyButton: () => void;
};

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }

  return target.isContentEditable;
};

export const useShellKeyboardShortcuts = ({
  onPaste,
  onDecrypt,
  onRunStructureTest,
  onEncrypt,
  onCopy,
  canRunStructureTest,
  canEncrypt,
  canCopy,
  focusCurrentWorkspaceTab,
  focusImportInput,
  focusRunValidationButton,
  focusExportOutput,
  focusEncryptButton,
  focusCopyButton,
}: UseShellKeyboardShortcutsArgs): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const normalizedKey = event.key.toLowerCase();
      const hasCtrlOrMeta = event.ctrlKey || event.metaKey;
      const editableTarget = isEditableTarget(event.target);

      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        if (normalizedKey === '1') {
          event.preventDefault();
          focusImportInput();
          return;
        }

        if (normalizedKey === '2') {
          event.preventDefault();
          focusRunValidationButton();
          return;
        }

        if (normalizedKey === '3') {
          event.preventDefault();
          focusCurrentWorkspaceTab();
          return;
        }

        if (normalizedKey === '4') {
          event.preventDefault();
          focusExportOutput();
          return;
        }
      }

      if (editableTarget) {
        return;
      }

      if (hasCtrlOrMeta && event.shiftKey && normalizedKey === 'v') {
        event.preventDefault();
        void onPaste();
        return;
      }

      if (hasCtrlOrMeta && event.shiftKey && normalizedKey === 't') {
        event.preventDefault();
        if (canRunStructureTest) {
          onRunStructureTest();
          focusRunValidationButton();
        }
        return;
      }

      if (hasCtrlOrMeta && event.shiftKey && normalizedKey === 'e') {
        event.preventDefault();
        if (canEncrypt) {
          onEncrypt();
          focusEncryptButton();
        }
        return;
      }

      if (hasCtrlOrMeta && event.shiftKey && normalizedKey === 'c') {
        event.preventDefault();
        if (canCopy) {
          void onCopy();
          focusCopyButton();
        }
      }

      if (hasCtrlOrMeta && normalizedKey === 'enter') {
        event.preventDefault();
        onDecrypt();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    canCopy,
    canEncrypt,
    canRunStructureTest,
    focusCopyButton,
    focusEncryptButton,
    focusExportOutput,
    focusCurrentWorkspaceTab,
    focusImportInput,
    focusRunValidationButton,
    onCopy,
    onDecrypt,
    onEncrypt,
    onPaste,
    onRunStructureTest,
  ]);
};
