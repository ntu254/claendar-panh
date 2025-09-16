import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#1890ff');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    const savedColor = localStorage.getItem('app-primary-color');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('app-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('app-primary-color', primaryColor);
  }, [primaryColor]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeColor = (color) => {
    setPrimaryColor(color);
  };

  const themeConfig = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
      borderRadius: 8,
      // Dark mode specific tokens
      ...(isDarkMode ? {
        colorBgContainer: '#141414',
        colorBgElevated: '#1f1f1f',
        colorBgLayout: '#000000',
        colorText: 'rgba(255, 255, 255, 0.85)',
        colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
        colorBorder: '#434343',
        colorSplit: '#434343',
      } : {
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f5f5f5',
        colorText: 'rgba(0, 0, 0, 0.88)',
        colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
        colorBorder: '#d9d9d9',
        colorSplit: '#f0f0f0',
      })
    },
    components: {
      Layout: {
        headerBg: isDarkMode ? '#001529' : primaryColor,
        bodyBg: isDarkMode ? '#000000' : '#f5f5f5',
      },
      Card: {
        colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
      },
      Calendar: {
        colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
      }
    }
  };

  const value = {
    isDarkMode,
    primaryColor,
    toggleTheme,
    changeColor,
    themeConfig
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={themeConfig}>
        <div style={{ 
          background: isDarkMode ? '#000000' : '#f5f5f5',
          minHeight: '100vh',
          transition: 'all 0.3s ease'
        }}>
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;