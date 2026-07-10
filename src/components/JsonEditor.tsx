import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  FaAlignLeft,
  FaAngleDown,
  FaAngleUp,
  FaArrowLeft,
  FaArrowRight,
  FaCopy,
  FaCrosshairs,
  FaDownload,
  FaSave,
  FaUndo,
} from 'react-icons/fa';
import { SaveDataRecord, SaveValidationIssue } from '../core/save/types';
import { useSaveActions, useSaveSelector } from '../contexts/SaveContext';
import JsonTextEditor, { JsonCursorState, JsonTextEditorHandle } from './JsonTextEditor';

interface JsonEditorProps {
  isActive: boolean;
}

const stringifyDocument = (value: unknown): string => JSON.stringify(value, null, 2);

const HISTORY_LIMIT = 60;
const HISTORY_COMMIT_DELAY_MS = 350;
const PARSE_DELAY_MS = 140;

interface ParseState {
  parsed: unknown | null;
  errorMessage: string | null;
  errorOffset: number | null;
  errorLine: number | null;
  errorColumn: number | null;
  isRootObject: boolean;
}

interface DraftHistoryState {
  entries: string[];
  index: number;
}

interface SearchState {
  query: string;
  caseSensitive: boolean;
}

const EMPTY_PARSE_STATE: ParseState = {
  parsed: null,
  errorMessage: null,
  errorOffset: null,
  errorLine: null,
  errorColumn: null,
  isRootObject: false,
};

const isSaveObjectRoot = (value: unknown): value is SaveDataRecord => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const extractJsonErrorPosition = (message: string): { offset: number | null; line: number | null; column: number | null } => {
  const offsetMatch = message.match(/\bposition\s+(\d+)\b/i);
  if (offsetMatch) {
    return { offset: Number(offsetMatch[1]), line: null, column: null };
  }

  const lineColumnMatch = message.match(/\bline\s+(\d+)\s+column\s+(\d+)\b/i);
  if (lineColumnMatch) {
    return {
      offset: null,
      line: Number(lineColumnMatch[1]),
      column: Number(lineColumnMatch[2]),
    };
  }

  return { offset: null, line: null, column: null };
};

const getLineColumnFromOffset = (text: string, offset: number): { line: number; column: number } => {
  const safeOffset = Math.max(0, Math.min(offset, text.length));
  let line = 1;
  let column = 1;

  for (let index = 0; index < safeOffset; index += 1) {
    if (text[index] === '\n') {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return { line, column };
};

const getOffsetFromLineColumn = (text: string, line: number, column: number): number => {
  if (line <= 1 && column <= 1) {
    return 0;
  }

  let currentLine = 1;
  let currentColumn = 1;

  for (let index = 0; index < text.length; index += 1) {
    if (currentLine === line && currentColumn === column) {
      return index;
    }

    if (text[index] === '\n') {
      currentLine += 1;
      currentColumn = 1;
    } else {
      currentColumn += 1;
    }
  }

  return text.length;
};

const parseDraft = (value: string): ParseState => {
  if (!value.trim()) {
    return {
      ...EMPTY_PARSE_STATE,
      errorMessage: 'JSON content is required.',
    };
  }

  try {
    const parsed = JSON.parse(value);
    return {
      parsed,
      errorMessage: null,
      errorOffset: null,
      errorLine: null,
      errorColumn: null,
      isRootObject: isSaveObjectRoot(parsed),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON';
    const extracted = extractJsonErrorPosition(message);

    if (extracted.offset !== null) {
      const location = getLineColumnFromOffset(value, extracted.offset);
      return {
        ...EMPTY_PARSE_STATE,
        errorMessage: message,
        errorOffset: extracted.offset,
        errorLine: location.line,
        errorColumn: location.column,
      };
    }

    const derivedOffset = extracted.line !== null && extracted.column !== null
      ? getOffsetFromLineColumn(value, extracted.line, extracted.column)
      : null;

    return {
      ...EMPTY_PARSE_STATE,
      errorMessage: message,
      errorOffset: derivedOffset,
      errorLine: extracted.line,
      errorColumn: extracted.column,
    };
  }
};

const pushHistoryEntry = (state: DraftHistoryState, value: string): DraftHistoryState => {
  if (state.index >= 0 && state.entries[state.index] === value) {
    return state;
  }

  const nextEntries = state.entries.slice(0, state.index + 1);
  nextEntries.push(value);

  const trimmedEntries = nextEntries.length > HISTORY_LIMIT
    ? nextEntries.slice(nextEntries.length - HISTORY_LIMIT)
    : nextEntries;

  return {
    entries: trimmedEntries,
    index: trimmedEntries.length - 1,
  };
};

const countOccurrences = (text: string, query: string, caseSensitive: boolean): number[] => {
  if (!query) {
    return [];
  }

  const haystack = caseSensitive ? text : text.toLowerCase();
  const needle = caseSensitive ? query : query.toLowerCase();
  if (!needle) {
    return [];
  }

  const offsets: number[] = [];
  let offset = 0;

  while (offset < haystack.length) {
    const nextOffset = haystack.indexOf(needle, offset);
    if (nextOffset === -1) {
      break;
    }

    offsets.push(nextOffset);
    offset = nextOffset + Math.max(needle.length, 1);
  }

  return offsets;
};

const summarizeValidation = (issues: SaveValidationIssue[]) => {
  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');

  return {
    errors,
    warnings,
  };
};

const copyTextToClipboard = async (value: string): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const didCopy = document.execCommand('copy');
  document.body.removeChild(textarea);
  return didCopy;
};

const JsonEditor: React.FC<JsonEditorProps> = ({ isActive }) => {
  const saveDocument = useSaveSelector((state) => (isActive ? state.document : null));
  const validation = useSaveSelector((state) => (isActive ? state.document?.validation ?? null : null));
  const { replaceSaveData } = useSaveActions();
  const [draft, setDraft] = useState('');
  const [baselineDraft, setBaselineDraft] = useState('');
  const [parseState, setParseState] = useState<ParseState>(EMPTY_PARSE_STATE);
  const [isParsing, setIsParsing] = useState(false);
  const [history, setHistory] = useState<DraftHistoryState>({ entries: [], index: -1 });
  const [searchState, setSearchState] = useState<SearchState>({ query: '', caseSensitive: false });
  const [cursorState, setCursorState] = useState<JsonCursorState>({ offset: 0, line: 1, column: 1 });
  const [liveMessage, setLiveMessage] = useState<string | null>(null);
  const editorRef = useRef<JsonTextEditorHandle | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const historyCommitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldAnnounceValidationRef = useRef(false);
  const editorLabelId = useId();
  const editorHelperId = useId();
  const editorStatusId = useId();
  const editorValidationId = useId();
  const searchStatusId = useId();

  const clearPendingHistoryCommit = () => {
    if (historyCommitTimerRef.current) {
      clearTimeout(historyCommitTimerRef.current);
      historyCommitTimerRef.current = null;
    }
  };

  const clearPendingParse = () => {
    if (parseTimerRef.current) {
      clearTimeout(parseTimerRef.current);
      parseTimerRef.current = null;
    }
  };

  const syncEditorState = useCallback((nextDraft: string, resetHistory = true) => {
    clearPendingParse();
    setDraft(nextDraft);
    setBaselineDraft(nextDraft);
    setParseState(parseDraft(nextDraft));
    setIsParsing(false);
    if (resetHistory) {
      setHistory({ entries: [nextDraft], index: 0 });
    }
  }, []);

  useEffect(() => {
    if (!saveDocument) {
      return;
    }

    const nextDraft = stringifyDocument(saveDocument.workingData);
    if (draft !== baselineDraft) {
      return;
    }

    clearPendingHistoryCommit();
    syncEditorState(nextDraft);
  }, [saveDocument, draft, baselineDraft, syncEditorState]);

  useEffect(() => {
    return () => {
      clearPendingHistoryCommit();
      clearPendingParse();
    };
  }, []);

  useEffect(() => {
    if (!liveMessage) {
      return;
    }

    const timeout = setTimeout(() => setLiveMessage(null), 2200);
    return () => clearTimeout(timeout);
  }, [liveMessage]);

  useEffect(() => {
    if (!shouldAnnounceValidationRef.current) {
      return;
    }

    shouldAnnounceValidationRef.current = false;
    const validationIssues = validation?.issues ?? [];
    const errors = validationIssues.filter((issue) => issue.severity === 'error').length;
    const warnings = validationIssues.filter((issue) => issue.severity === 'warning').length;
    if (validationIssues.length === 0) {
      setLiveMessage('Changes applied.');
      return;
    }

    setLiveMessage(`Validation after apply: ${errors} error${errors === 1 ? '' : 's'} and ${warnings} warning${warnings === 1 ? '' : 's'}.`);
  }, [validation]);

  const handleCursorChange = useCallback((nextCursorState: JsonCursorState) => {
    setCursorState((currentCursorState) => {
      if (
        currentCursorState.offset === nextCursorState.offset
        && currentCursorState.line === nextCursorState.line
        && currentCursorState.column === nextCursorState.column
      ) {
        return currentCursorState;
      }

      return nextCursorState;
    });
  }, []);

  const handleDraftChange = (nextDraft: string) => {
    setDraft(nextDraft);
    setIsParsing(true);
    clearPendingParse();
    parseTimerRef.current = setTimeout(() => {
      setParseState(parseDraft(nextDraft));
      setIsParsing(false);
      parseTimerRef.current = null;
    }, PARSE_DELAY_MS);
    clearPendingHistoryCommit();
    historyCommitTimerRef.current = setTimeout(() => {
      setHistory((current) => pushHistoryEntry(current, nextDraft));
      historyCommitTimerRef.current = null;
    }, HISTORY_COMMIT_DELAY_MS);
  };

  const handleFormat = () => {
    if (!parseState.parsed) {
      return;
    }

    const formattedDraft = stringifyDocument(parseState.parsed);
    clearPendingHistoryCommit();
    clearPendingParse();
    setDraft(formattedDraft);
    setParseState(parseDraft(formattedDraft));
    setIsParsing(false);
    setHistory((current) => pushHistoryEntry(current, formattedDraft));
    setLiveMessage('Draft formatted.');
  };

  const handleReset = () => {
    if (!baselineDraft) {
      return;
    }

    clearPendingHistoryCommit();
    clearPendingParse();
    setDraft(baselineDraft);
    setParseState(parseDraft(baselineDraft));
    setIsParsing(false);
    setHistory({ entries: [baselineDraft], index: 0 });
    setLiveMessage('Draft reset to the current save.');
  };

  const handleApply = () => {
    if (!parseState.isRootObject || !parseState.parsed) {
      return;
    }

    const committedDraft = stringifyDocument(parseState.parsed);
    clearPendingHistoryCommit();
    clearPendingParse();
    shouldAnnounceValidationRef.current = true;
    replaceSaveData(parseState.parsed as SaveDataRecord);
    setDraft(committedDraft);
    setBaselineDraft(committedDraft);
    setParseState(parseDraft(committedDraft));
    setIsParsing(false);
    setHistory({ entries: [committedDraft], index: 0 });
    setLiveMessage('Draft applied to the save.');
  };

  const handleUndo = () => {
    if (history.index <= 0) {
      return;
    }

    clearPendingHistoryCommit();
    clearPendingParse();
    const nextIndex = history.index - 1;
    const nextDraft = history.entries[nextIndex];
    setHistory((current) => ({ ...current, index: nextIndex }));
    setDraft(nextDraft);
    setParseState(parseDraft(nextDraft));
    setIsParsing(false);
    setLiveMessage('Local undo applied.');
  };

  const handleRedo = () => {
    if (history.index === -1 || history.index >= history.entries.length - 1) {
      return;
    }

    clearPendingHistoryCommit();
    clearPendingParse();
    const nextIndex = history.index + 1;
    const nextDraft = history.entries[nextIndex];
    setHistory((current) => ({ ...current, index: nextIndex }));
    setDraft(nextDraft);
    setParseState(parseDraft(nextDraft));
    setIsParsing(false);
    setLiveMessage('Local redo applied.');
  };

  const handleCopyDraft = async () => {
    try {
      const copied = await copyTextToClipboard(draft);
      setLiveMessage(copied ? 'Draft copied to clipboard.' : 'Copy is unavailable in this browser.');
    } catch {
      setLiveMessage('Copy failed.');
    }
  };

  const handleExportDraft = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const blob = new Blob([draft], { type: 'application/json;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `antimatter-dimensions-${saveDocument?.sourceType ?? 'save'}-draft.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setLiveMessage('Draft exported as JSON.');
  };

  const handleJumpToError = () => {
    if (parseState.errorOffset === null) {
      return;
    }

    editorRef.current?.jumpToOffset(parseState.errorOffset);
    setLiveMessage('Jumped to the parse error location.');
  };

  const handleFindNext = () => {
    if (!searchState.query) {
      searchInputRef.current?.focus();
      return;
    }

    if (searchMatchCount === 0) {
      setLiveMessage('No search matches found.');
      return;
    }

    const nextIndex = currentSearchMatch > 0 ? currentSearchMatch % searchMatchCount : 0;
    jumpToSearchMatch(nextIndex);
  };

  const handleFindPrevious = () => {
    if (!searchState.query) {
      searchInputRef.current?.focus();
      return;
    }

    if (searchMatchCount === 0) {
      setLiveMessage('No search matches found.');
      return;
    }

    const previousIndex = currentSearchMatch > 1 ? currentSearchMatch - 2 : searchMatchCount - 1;
    jumpToSearchMatch(previousIndex);
  };

  const focusSearchInput = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.select();
  };

  const hasLocalChanges = draft !== baselineDraft;
  const normalizedSearchQuery = searchState.query.trim();
  const isEditorInvalid = Boolean(parseState.errorMessage) || (!isParsing && !parseState.isRootObject);
  const canApply = !isParsing && parseState.isRootObject && hasLocalChanges;
  const searchMatches = useMemo(
    () => countOccurrences(draft, normalizedSearchQuery, searchState.caseSensitive),
    [draft, normalizedSearchQuery, searchState.caseSensitive],
  );
  const searchMatchCount = searchMatches.length;
  const currentSearchMatch = useMemo(() => {
    if (!normalizedSearchQuery || searchMatches.length === 0) {
      return 0;
    }

    const selectedMatch = searchMatches.findIndex((offset) => {
      const endOffset = offset + normalizedSearchQuery.length;
      return cursorState.offset >= offset && cursorState.offset <= endOffset;
    });

    if (selectedMatch >= 0) {
      return selectedMatch + 1;
    }

    const upcomingMatch = searchMatches.findIndex((offset) => offset >= cursorState.offset);
    return upcomingMatch >= 0 ? upcomingMatch + 1 : searchMatches.length;
  }, [cursorState.offset, searchMatches, normalizedSearchQuery]);

  const jumpToSearchMatch = useCallback((matchIndex: number) => {
    if (!normalizedSearchQuery || searchMatches.length === 0) {
      return false;
    }

    const boundedIndex = Math.max(0, Math.min(matchIndex, searchMatches.length - 1));
    const matchOffset = searchMatches[boundedIndex];
    editorRef.current?.selectRange(matchOffset, matchOffset + normalizedSearchQuery.length);
    setLiveMessage(`Search match ${boundedIndex + 1} of ${searchMatches.length}.`);
    return true;
  }, [searchMatches, normalizedSearchQuery]);

  const validationSummary = useMemo(
    () => summarizeValidation(validation?.issues ?? []),
    [validation],
  );
  const validationIssues = validation?.issues ?? [];
  const visibleValidationIssues = validationIssues.slice(0, 8);
  const hiddenValidationIssueCount = Math.max(validationIssues.length - visibleValidationIssues.length, 0);
  const statusMessage = isParsing
    ? 'Parsing draft...'
    : parseState.errorMessage
    ? parseState.errorMessage
    : !parseState.isRootObject
      ? 'JSON root must be an object to match the save document model.'
      : hasLocalChanges
        ? 'Draft is ready to apply.'
        : '';
  const showStatus = isParsing || isEditorInvalid || hasLocalChanges;

  if (!isActive) {
    return null;
  }

  if (!saveDocument) {
    return (
      <div className="editor-empty-state compact">
        <h3>JSON editor is unavailable</h3>
        <p>Decode a save before opening the expert editor.</p>
      </div>
    );
  }

  return (
    <div className="json-editor-shell" aria-label="Full document JSON editor" aria-busy={isParsing}>
      <div className="json-editor-toolbar">
        <div className="json-editor-heading">
          <h3 id={editorLabelId}>Full document editor</h3>
          <p>Edit the complete save data, then apply the parsed draft.</p>
        </div>
        <div className="json-editor-actions">
          <button type="button" className="btn secondary" onClick={handleUndo} disabled={history.index <= 0}>
            <FaArrowLeft aria-hidden="true" /> Undo
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={handleRedo}
            disabled={history.index === -1 || history.index >= history.entries.length - 1}
          >
            <FaArrowRight aria-hidden="true" /> Redo
          </button>
          <button type="button" className="btn secondary" onClick={handleFormat} disabled={!parseState.parsed}>
            <FaAlignLeft aria-hidden="true" /> Format
          </button>
          <button type="button" className="btn secondary" onClick={handleReset}>
            <FaUndo aria-hidden="true" /> Reset
          </button>
          <button type="button" className="btn secondary" onClick={handleCopyDraft}>
            <FaCopy aria-hidden="true" /> Copy
          </button>
          <button type="button" className="btn secondary" onClick={handleExportDraft}>
            <FaDownload aria-hidden="true" /> Export
          </button>
          <button type="button" className="btn primary" onClick={handleApply} disabled={!canApply}>
            <FaSave aria-hidden="true" /> Apply changes
          </button>
        </div>
      </div>

      <div className="json-editor-search" role="search" aria-label="Search in JSON draft">
        <label className="json-editor-search__label" htmlFor="json-editor-search-input">
          Find in draft
        </label>
        <input
          ref={searchInputRef}
          id="json-editor-search-input"
          className="json-editor-search__input"
          type="search"
          aria-describedby={searchStatusId}
          value={searchState.query}
          placeholder="Search keys or values"
          onChange={(event) => {
            setSearchState((current) => ({ ...current, query: event.target.value }));
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (event.shiftKey) {
                handleFindPrevious();
                return;
              }

              handleFindNext();
            }
          }}
        />
        <label className="json-editor-search__toggle">
          <input
            type="checkbox"
            checked={searchState.caseSensitive}
            onChange={(event) => {
              setSearchState((current) => ({ ...current, caseSensitive: event.target.checked }));
            }}
          />
          Case sensitive
        </label>
        <span id={searchStatusId} className="json-editor-search__status" role="status" aria-live="polite" aria-atomic="true">
          {searchState.query
            ? (searchMatchCount > 0 ? `${currentSearchMatch} of ${searchMatchCount}` : 'No matches')
            : 'Enter a term to search the draft'}
        </span>
        <button
          type="button"
          className="btn secondary"
          onClick={handleFindPrevious}
          disabled={!searchState.query || searchMatchCount === 0}
          aria-label="Go to the previous search result"
        >
          <FaAngleUp aria-hidden="true" />
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={handleFindNext}
          disabled={!searchState.query || searchMatchCount === 0}
          aria-label="Go to the next search result"
        >
          <FaAngleDown aria-hidden="true" />
        </button>
      </div>

      <div className="json-editor-surface">
        <JsonTextEditor
          ref={editorRef}
          value={draft}
          searchQuery={searchState.query}
          caseSensitive={searchState.caseSensitive}
          invalid={isEditorInvalid}
          describedBy={`${editorHelperId}${showStatus ? ` ${editorStatusId}` : ''}${validationIssues.length > 0 ? ` ${editorValidationId}` : ''}`}
          onChange={handleDraftChange}
          onCursorChange={handleCursorChange}
          onRequestSearchFocus={focusSearchInput}
          onApplyShortcut={handleApply}
          onFormatShortcut={handleFormat}
          onResetShortcut={handleReset}
          onUndoShortcut={handleUndo}
          onRedoShortcut={handleRedo}
          onNextSearchShortcut={handleFindNext}
          onPreviousSearchShortcut={handleFindPrevious}
        />
      </div>

      <p id={editorHelperId} className="json-editor-helper">
        Changes stay in this draft until you click Apply changes.
      </p>

      {showStatus && (
        <div
          id={editorStatusId}
          className={`json-editor-status-block${isEditorInvalid ? ' is-error' : ''}`}
          role={isEditorInvalid ? 'alert' : 'status'}
        >
          <div className="json-editor-status-block__summary">
            <span>{statusMessage}</span>
            {parseState.errorLine !== null && parseState.errorColumn !== null && (
              <span className="json-editor-status-block__location">
                Line {parseState.errorLine}, column {parseState.errorColumn}
              </span>
            )}
          </div>
          {parseState.errorOffset !== null && (
            <button type="button" className="btn secondary" onClick={handleJumpToError}>
              <FaCrosshairs aria-hidden="true" /> Jump to error
            </button>
          )}
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {liveMessage ?? ''}
      </div>

      {validationIssues.length > 0 && (
        <div className="json-validation-summary" id={editorValidationId}>
          <h3>Validation after apply</h3>
          <div className="json-validation-summary__meta">
            <span className="status-chip danger">{validationSummary.errors.length} errors</span>
            <span className="status-chip warning">{validationSummary.warnings.length} warnings</span>
          </div>

          <ul className="validation-issue-list json-validation-summary__issues">
            {visibleValidationIssues.map((issue) => (
              <li key={`${issue.code}-${issue.path ?? issue.message}`}>
                <span className={`issue-severity-pill ${issue.severity}`}>{issue.severity.toUpperCase()}</span>
                <span>{issue.message}</span>
                {issue.path && <span className="issue-path">{issue.path}</span>}
              </li>
            ))}
          </ul>

          {hiddenValidationIssueCount > 0 && (
            <p className="json-editor-helper">
              {hiddenValidationIssueCount} additional validation issue{hiddenValidationIssueCount > 1 ? 's' : ''} hidden for brevity.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JsonEditor;
