import React from 'react';
import Main from './components/Main';
import { ThemeProvider } from './contexts/ThemeContext';
import { SaveProvider } from './contexts/SaveContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SaveProvider>
        <div className="app">
          <a className="skip-link" href="#save-editor">Skip to editor</a>
          <Main />
        </div>
      </SaveProvider>
    </ThemeProvider>
  );
};

export default App;
