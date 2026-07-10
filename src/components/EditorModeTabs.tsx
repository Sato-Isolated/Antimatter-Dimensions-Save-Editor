import React, { useRef } from 'react';

export type EditorMode = 'structured' | 'json';

type EditorModeTabsProps = {
  activeMode: EditorMode;
  onChange: (mode: EditorMode) => void;
};

const editorModes: EditorMode[] = ['structured', 'json'];

const EditorModeTabs: React.FC<EditorModeTabsProps> = ({ activeMode, onChange }) => {
  const tabRefs = useRef<Record<EditorMode, HTMLButtonElement | null>>({
    structured: null,
    json: null,
  });

  const selectAndFocus = (mode: EditorMode): void => {
    onChange(mode);
    tabRefs.current[mode]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, mode: EditorMode): void => {
    const currentIndex = editorModes.indexOf(mode);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectAndFocus(editorModes[(currentIndex + 1) % editorModes.length]);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectAndFocus(editorModes[(currentIndex - 1 + editorModes.length) % editorModes.length]);
    }
  };

  return (
    <div className="editor-mode-tabs" role="tablist" aria-label="Editor mode">
      {editorModes.map((mode) => {
        const isActive = mode === activeMode;
        const label = mode === 'structured' ? 'Structured' : 'JSON';

        return (
          <button
            key={mode}
            ref={(element) => { tabRefs.current[mode] = element; }}
            type="button"
            id={`editor-mode-${mode}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`editor-panel-${mode}`}
            tabIndex={isActive ? 0 : -1}
            className={isActive ? 'active' : ''}
            onClick={() => onChange(mode)}
            onKeyDown={(event) => handleKeyDown(event, mode)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default EditorModeTabs;
