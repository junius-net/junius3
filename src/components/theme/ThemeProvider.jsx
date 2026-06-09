"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("theme-dark");

  useEffect(() => {
    // Sync theme to HTML tag for global variables
    const html = document.documentElement;
    html.className = html.className.replace(/theme-\w+/, theme);
    if (!html.className.includes(theme)) {
      html.className += ` ${theme}`;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
