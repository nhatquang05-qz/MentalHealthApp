import React, { createContext, useState, useContext, ReactNode } from 'react';

export const themeColors = {
  light: {
    background: '#f4f7ff',
    card: '#ffffff',       
    text: '#1a1a1a',       
    subText: '#8e8e93',    
    primary: '#3995E9',    
    border: '#f0f0f0',
    iconBg: '#E3F2FD',     
    danger: '#FF3B30',
    success: '#34C759',
    inputBg: '#F3F4F6',
  },
  dark: {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    subText: '#A1A1AA',
    primary: '#3995E9',
    border: '#333333',
    iconBg: '#2C3E50',
    danger: '#FF453A',
    success: '#30D158',
    inputBg: '#2C2C2C',
  },
};

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof themeColors.light;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = themeColors[theme];
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};