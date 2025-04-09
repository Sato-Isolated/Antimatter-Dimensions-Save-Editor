import React, { createContext, useContext, useState, useEffect } from 'react';

// Available theme types
export type ThemeType = 'light' | 'dark' | 'antimatter' | 'infinity' | 'eternity' | 'reality';

// Interface for theme context
interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Creating context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme context provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get theme from localStorage or use default theme
  const getInitialTheme = (): ThemeType => {
    // Check if a theme is stored in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      // Check if the theme is among the allowed values
      const storedTheme = window.localStorage.getItem('theme') as ThemeType;
      if (storedTheme && ['light', 'dark', 'antimatter', 'infinity', 'eternity', 'reality'].includes(storedTheme)) {
        return storedTheme;
      }
      
      // Check system preferences if no theme is saved
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    // Default to light theme
    return 'light';
  };
  
  // State to store the current theme
  const [theme, setThemeState] = useState<ThemeType>(getInitialTheme);
  
  // Function to toggle between themes
  const toggleTheme = () => {
    const themes: ThemeType[] = ['light', 'dark', 'antimatter', 'infinity', 'eternity', 'reality'];
    const currentIndex = themes.indexOf(theme);
    setThemeState(themes[(currentIndex + 1) % themes.length]);
  };
  
  // Function to set the theme
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };
  
  // Update the class on the document and save in localStorage
  useEffect(() => {
    // Save theme in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('theme', theme);
    }
    
    // Remove all previous theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'infinity-theme', 'eternity-theme', 'reality-theme', 'antimatter-theme');
    
    // Add the appropriate theme class
    document.documentElement.classList.add(`${theme}-theme`);
    
    // Update theme-color meta tag for mobile devices
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Set appropriate color based on theme
      let themeColor = '#ffffff'; // Default light theme color
      
      switch (theme) {
        case 'dark':
          themeColor = '#121212';
          break;
        case 'antimatter':
          themeColor = '#130826';
          break;
        case 'infinity':
          themeColor = '#1a3b5c';
          break;
        case 'eternity':
          themeColor = '#3a1042';
          break;
        case 'reality':
          themeColor = '#340909';
          break;
        default:
          themeColor = '#ffffff';
      }
      
      metaThemeColor.setAttribute('content', themeColor);
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 