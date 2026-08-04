import React from 'react';
import AppShell from './AppShell';
import { ThemeProvider } from './state/ThemeContext';
import { SaveProvider } from './state/SaveContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SaveProvider>
        <div className="app">
          <a className="skip-link" href="#save-editor">Skip to editor</a>
          <AppShell />
        </div>
      </SaveProvider>
    </ThemeProvider>
  );
};

export default App;
