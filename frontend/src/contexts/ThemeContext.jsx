import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('pink');

  const themeClasses = {
    pink: {
      primary: 'bg-pink-500',
      primaryHover: 'hover:bg-pink-600',
      primaryLight: 'bg-pink-100',
      primaryText: 'text-pink-700',
      gradient: 'from-pink-50 via-purple-50 to-rose-50',
      glass: 'bg-white/70 backdrop-blur-lg border border-white/20',
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};