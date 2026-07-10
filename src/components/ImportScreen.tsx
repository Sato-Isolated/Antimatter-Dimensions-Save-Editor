import React from 'react';

type ImportScreenProps = {
  value: string;
  errorMessage: string | null;
  onChange: (value: string) => void;
  onPaste: () => void;
  onOpen: () => void;
};

const ImportScreen: React.FC<ImportScreenProps> = ({
  value,
  errorMessage,
  onChange,
  onPaste,
  onOpen,
}) => {
  const canOpen = value.trim().length > 0;

  return (
    <main className="import-screen" id="save-editor">
      <section className="import-content" aria-labelledby="import-title">
        <header className="import-heading">
          <h1 id="import-title">Import a save</h1>
          <p>Paste your encrypted PC or Android save. Everything stays in your browser.</p>
        </header>

        <div className="import-field">
          <label htmlFor="encrypted-save">Encrypted save</label>
          <textarea
            id="encrypted-save"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Paste your save data here…"
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? 'import-error' : 'import-privacy'}
            autoComplete="off"
            spellCheck={false}
          />
          {errorMessage ? (
            <p className="field-error" id="import-error" role="alert">{errorMessage}</p>
          ) : null}
        </div>

        <div className="import-actions">
          <button type="button" className="text-button" onClick={onPaste}>Paste from clipboard</button>
          <button type="button" className="primary-button" onClick={onOpen} disabled={!canOpen}>Open editor</button>
        </div>

        <p className="import-privacy" id="import-privacy">Your save is processed locally and never uploaded.</p>
      </section>
    </main>
  );
};

export default ImportScreen;
