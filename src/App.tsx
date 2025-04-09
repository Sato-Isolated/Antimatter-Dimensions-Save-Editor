import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { SaveProvider } from './contexts/SaveContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SaveProvider>
        <div className="app">
          <Header />
          <Main />
          <Footer />
        </div>
      </SaveProvider>
    </ThemeProvider>
  );
}

export default App; 