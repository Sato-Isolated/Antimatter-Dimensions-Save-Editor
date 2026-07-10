import React from 'react';
import { ThemeType, useTheme } from '../contexts/ThemeContext';

type ThemeInfo = {
  id: ThemeType;
  name: string;
  description: string;
  colors: [string, string, string];
};

const themes: ThemeInfo[] = [
  { id: 'dark', name: 'Dark', description: 'Cosmic editorial blue on deep ink.', colors: ['#55b7ff', '#070a11', '#111923'] },
  { id: 'light', name: 'Light', description: 'Cool white surfaces with crisp blue.', colors: ['#2563eb', '#f5f7fb', '#ffffff'] },
  { id: 'antimatter', name: 'Antimatter', description: 'Focused violet over near-black.', colors: ['#9f6bff', '#090516', '#180f30'] },
  { id: 'infinity', name: 'Infinity', description: 'Cold cyan over ocean-blue depth.', colors: ['#38bdf8', '#061626', '#102c46'] },
  { id: 'eternity', name: 'Eternity', description: 'Copper highlights on warm graphite.', colors: ['#f97316', '#160f0b', '#2f1e14'] },
  { id: 'reality', name: 'Reality', description: 'Technical green with teal shadows.', colors: ['#22c55e', '#071712', '#122d22'] },
];

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset className="theme-picker">
      <legend>Theme</legend>
      <div className="theme-options">
        {themes.map((themeItem) => (
          <label key={themeItem.id} className={`theme-option ${theme === themeItem.id ? 'active' : ''}`}>
            <input
              type="radio"
              name="application-theme"
              value={themeItem.id}
              checked={theme === themeItem.id}
              onChange={() => setTheme(themeItem.id)}
            />
            <span className="theme-option-copy">
              <strong>{themeItem.name}</strong>
              <small>{themeItem.description}</small>
            </span>
            <span className="theme-swatches" aria-hidden="true">
              {themeItem.colors.map((color) => <span key={color} style={{ backgroundColor: color }} />)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default ThemeSelector;
