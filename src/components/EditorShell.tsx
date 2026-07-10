import React, { Suspense, forwardRef, lazy, useEffect, useImperativeHandle, useRef, useState } from 'react';
import EditorModeTabs, { EditorMode } from './EditorModeTabs';
import StructuredEditor, { StructuredEditorHandle } from './StructuredEditor';

const JsonEditor = lazy(() => import('./JsonEditor'));

export type EditorShellHandle = {
  focusFirstError: () => void;
};

type EditorShellProps = {
  mode: EditorMode;
  validationMessage: string | null;
  onModeChange: (mode: EditorMode) => void;
};

const EditorShell = forwardRef<EditorShellHandle, EditorShellProps>(({
  mode,
  validationMessage,
  onModeChange,
}, ref) => {
  const [hasMountedJson, setHasMountedJson] = useState(mode === 'json');
  const structuredEditorRef = useRef<StructuredEditorHandle | null>(null);

  useEffect(() => {
    if (mode === 'json') {
      setHasMountedJson(true);
    }
  }, [mode]);

  useImperativeHandle(ref, () => ({
    focusFirstError: () => {
      onModeChange('structured');
      window.setTimeout(() => structuredEditorRef.current?.focusFirstError(), 0);
    },
  }), [onModeChange]);

  const tabs = <EditorModeTabs activeMode={mode} onChange={onModeChange} />;

  return (
    <main className="editor-shell" id="save-editor">
      {validationMessage ? <p className="editor-validation-alert" role="alert">{validationMessage}</p> : null}

      <section
        id="editor-panel-structured"
        role="tabpanel"
        aria-labelledby="editor-mode-structured"
        hidden={mode !== 'structured'}
      >
        <StructuredEditor
          ref={structuredEditorRef}
          isActive={mode === 'structured'}
          toolbarAside={tabs}
        />
      </section>

      {(mode === 'json' || hasMountedJson) ? (
        <section
          id="editor-panel-json"
          className="json-mode-view"
          role="tabpanel"
          aria-labelledby="editor-mode-json"
          hidden={mode !== 'json'}
        >
          <header className="editor-document-header json-document-header">
            <div>
              <h2>JSON</h2>
              <p>Edit the complete save document for advanced changes.</p>
            </div>
            {tabs}
          </header>
          <Suspense fallback={<p className="editor-loading" role="status">Loading JSON editor…</p>}>
            <JsonEditor isActive={mode === 'json'} />
          </Suspense>
        </section>
      ) : null}
    </main>
  );
});

EditorShell.displayName = 'EditorShell';

export default EditorShell;
