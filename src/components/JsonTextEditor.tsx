import React, {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

export interface JsonCursorState {
  offset: number;
  line: number;
  column: number;
}

export interface JsonTextEditorHandle {
  focus: () => void;
  jumpToOffset: (offset: number) => void;
  selectRange: (from: number, to: number) => void;
  findNext: () => boolean;
  findPrevious: () => boolean;
}

interface JsonTextEditorProps {
  value: string;
  searchQuery: string;
  caseSensitive: boolean;
  invalid: boolean;
  describedBy: string;
  onChange: (value: string) => void;
  onCursorChange: (cursor: JsonCursorState) => void;
  onRequestSearchFocus: () => void;
  onApplyShortcut: () => void;
  onFormatShortcut: () => void;
  onResetShortcut: () => void;
  onUndoShortcut: () => void;
  onRedoShortcut: () => void;
  onNextSearchShortcut: () => void;
  onPreviousSearchShortcut: () => void;
}

const clampOffset = (offset: number, length: number): number => Math.max(0, Math.min(offset, length));

const getCursorState = (value: string, offset: number): JsonCursorState => {
  const safeOffset = clampOffset(offset, value.length);
  const precedingValue = value.slice(0, safeOffset);
  const lines = precedingValue.split('\n');

  return {
    offset: safeOffset,
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  };
};

const JsonTextEditor = forwardRef<JsonTextEditorHandle, JsonTextEditorProps>(function JsonTextEditor(
  {
    value,
    searchQuery,
    caseSensitive,
    invalid,
    describedBy,
    onChange,
    onCursorChange,
    onRequestSearchFocus,
    onApplyShortcut,
    onFormatShortcut,
    onResetShortcut,
    onUndoShortcut,
    onRedoShortcut,
    onNextSearchShortcut,
    onPreviousSearchShortcut,
  },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLPreElement | null>(null);
  const lineNumbers = useMemo(
    () => Array.from({ length: Math.max(value.split('\n').length, 1) }, (_, index) => index + 1).join('\n'),
    [value],
  );

  const reportCursor = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    onCursorChange(getCursorState(textarea.value, textarea.selectionStart));
  }, [onCursorChange]);

  const selectRange = useCallback((from: number, to: number): void => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const safeFrom = clampOffset(from, textarea.value.length);
    const safeTo = clampOffset(Math.max(from, to), textarea.value.length);
    textarea.focus();
    textarea.setSelectionRange(safeFrom, safeTo);
    reportCursor();
  }, [reportCursor]);

  const findMatch = useCallback((direction: 'next' | 'previous'): boolean => {
    const textarea = textareaRef.current;
    const query = searchQuery;
    if (!textarea || !query) {
      return false;
    }

    const source = caseSensitive ? textarea.value : textarea.value.toLocaleLowerCase();
    const needle = caseSensitive ? query : query.toLocaleLowerCase();
    let matchOffset = -1;

    if (direction === 'next') {
      matchOffset = source.indexOf(needle, textarea.selectionEnd);
      if (matchOffset < 0) {
        matchOffset = source.indexOf(needle);
      }
    } else {
      const previousOffset = textarea.selectionStart - 1;
      matchOffset = previousOffset >= 0 ? source.lastIndexOf(needle, previousOffset) : -1;
      if (matchOffset < 0) {
        matchOffset = source.lastIndexOf(needle);
      }
    }

    if (matchOffset < 0) {
      return false;
    }

    selectRange(matchOffset, matchOffset + query.length);
    return true;
  }, [caseSensitive, searchQuery, selectRange]);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    jumpToOffset: (offset: number) => selectRange(offset, offset),
    selectRange,
    findNext: () => findMatch('next'),
    findPrevious: () => findMatch('previous'),
  }), [findMatch, selectRange]);

  const replaceSelection = useCallback((replacement: string, selectionStart: number, selectionEnd: number): void => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const nextValue = `${textarea.value.slice(0, textarea.selectionStart)}${replacement}${textarea.value.slice(textarea.selectionEnd)}`;
    onChange(nextValue);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
      reportCursor();
    });
  }, [onChange, reportCursor]);

  const handleTab = useCallback((event: KeyboardEvent<HTMLTextAreaElement>): void => {
    event.preventDefault();
    const textarea = event.currentTarget;
    const { selectionStart, selectionEnd, value: currentValue } = textarea;

    if (selectionStart === selectionEnd) {
      const indentation = event.shiftKey ? '' : '  ';
      if (!indentation) {
        const lineStart = currentValue.lastIndexOf('\n', selectionStart - 1) + 1;
        const removable = currentValue.slice(lineStart, selectionStart).match(/^ {1,2}/u)?.[0].length ?? 0;
        if (removable > 0) {
          textarea.setSelectionRange(lineStart, selectionStart);
          replaceSelection('', selectionStart - removable, selectionStart - removable);
        }
        return;
      }

      replaceSelection(indentation, selectionStart + indentation.length, selectionStart + indentation.length);
      return;
    }

    const firstLineStart = currentValue.lastIndexOf('\n', selectionStart - 1) + 1;
    const selectedBlock = currentValue.slice(firstLineStart, selectionEnd);
    const lines = selectedBlock.split('\n');
    const transformedLines = event.shiftKey
      ? lines.map((line) => line.replace(/^ {1,2}/u, ''))
      : lines.map((line) => `  ${line}`);
    const replacement = transformedLines.join('\n');
    const selectionDelta = replacement.length - selectedBlock.length;
    textarea.setSelectionRange(firstLineStart, selectionEnd);
    replaceSelection(replacement, firstLineStart, selectionEnd + selectionDelta);
  }, [replaceSelection]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>): void => {
    const mod = event.ctrlKey || event.metaKey;

    if (event.key === 'Tab') {
      handleTab(event);
      return;
    }

    if (mod && event.key.toLocaleLowerCase() === 'f' && !event.shiftKey) {
      event.preventDefault();
      onRequestSearchFocus();
      return;
    }

    if (mod && event.key.toLocaleLowerCase() === 's') {
      event.preventDefault();
      onApplyShortcut();
      return;
    }

    if (mod && event.shiftKey && event.key.toLocaleLowerCase() === 'f') {
      event.preventDefault();
      onFormatShortcut();
      return;
    }

    if (mod && event.shiftKey && event.key.toLocaleLowerCase() === 'r') {
      event.preventDefault();
      onResetShortcut();
      return;
    }

    if (mod && event.key.toLocaleLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) {
        onRedoShortcut();
      } else {
        onUndoShortcut();
      }
      return;
    }

    if (mod && event.key.toLocaleLowerCase() === 'y') {
      event.preventDefault();
      onRedoShortcut();
      return;
    }

    if (event.key === 'F3' || (mod && event.key.toLocaleLowerCase() === 'g')) {
      event.preventDefault();
      if (event.shiftKey) {
        onPreviousSearchShortcut();
      } else {
        onNextSearchShortcut();
      }
    }
  }, [
    handleTab,
    onApplyShortcut,
    onFormatShortcut,
    onNextSearchShortcut,
    onPreviousSearchShortcut,
    onRedoShortcut,
    onRequestSearchFocus,
    onResetShortcut,
    onUndoShortcut,
  ]);

  return (
    <div className={`json-text-editor${invalid ? ' is-invalid' : ''}`}>
      <pre ref={gutterRef} className="json-text-editor__gutter" aria-hidden="true">{lineNumbers}</pre>
      <textarea
        ref={textareaRef}
        className="json-text-editor__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onClick={reportCursor}
        onKeyUp={reportCursor}
        onSelect={reportCursor}
        onKeyDown={handleKeyDown}
        onScroll={(event) => {
          if (gutterRef.current) {
            gutterRef.current.scrollTop = event.currentTarget.scrollTop;
          }
        }}
        aria-label="Full save document JSON"
        aria-describedby={describedBy}
        aria-invalid={invalid}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        wrap="off"
      />
    </div>
  );
});

export default JsonTextEditor;
