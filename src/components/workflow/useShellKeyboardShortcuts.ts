import { RefObject, useEffect } from 'react';

type UseShellKeyboardShortcutsArgs = {
  onPaste: () => void | Promise<void>;
  onDecrypt: () => void;
  onRunStructureTest: () => void;
  onEncrypt: () => void;
  onCopy: () => void | Promise<void>;
  canRunStructureTest: boolean;
  canEncrypt: boolean;
  canCopy: boolean;
  importInputRef: RefObject<HTMLTextAreaElement | null>;
  runStructureTestButtonRef: RefObject<HTMLButtonElement | null>;
  encryptButtonRef: RefObject<HTMLButtonElement | null>;
  copyButtonRef: RefObject<HTMLButtonElement | null>;
  focusCurrentWorkspaceTab: () => void;
  exportOutputRef: RefObject<HTMLTextAreaElement | null>;
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
  importInputRef,
  runStructureTestButtonRef,
  encryptButtonRef,
  copyButtonRef,
  focusCurrentWorkspaceTab,
  exportOutputRef,
}: UseShellKeyboardShortcutsArgs): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const normalizedKey = event.key.toLowerCase();
      const hasCtrlOrMeta = event.ctrlKey || event.metaKey;
      const editableTarget = isEditableTarget(event.target);

      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        if (normalizedKey === '1') {
          event.preventDefault();
          importInputRef.current?.focus();
          return;
        }

        if (normalizedKey === '2') {
          event.preventDefault();
          runStructureTestButtonRef.current?.focus();
          return;
        }

        if (normalizedKey === '3') {
          event.preventDefault();
          focusCurrentWorkspaceTab();
          return;
        }

        if (normalizedKey === '4') {
          event.preventDefault();
          exportOutputRef.current?.focus();
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
          runStructureTestButtonRef.current?.focus();
        }
        return;
      }

      if (hasCtrlOrMeta && event.shiftKey && normalizedKey === 'e') {
        event.preventDefault();
        if (canEncrypt) {
          onEncrypt();
          encryptButtonRef.current?.focus();
        }
        return;
      }

      if (hasCtrlOrMeta && event.shiftKey && normalizedKey === 'c') {
        event.preventDefault();
        if (canCopy) {
          void onCopy();
          copyButtonRef.current?.focus();
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
    copyButtonRef,
    encryptButtonRef,
    exportOutputRef,
    focusCurrentWorkspaceTab,
    importInputRef,
    onCopy,
    onDecrypt,
    onEncrypt,
    onPaste,
    onRunStructureTest,
    runStructureTestButtonRef,
  ]);
};
