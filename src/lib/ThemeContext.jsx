import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "launch_irc_theme";
const ThemeContext = createContext(undefined);

const getSystemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const readStoredTheme = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  } catch {
    return "system";
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(readStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    readStoredTheme() === "system" ? getSystemTheme() : readStoredTheme(),
  );

  useEffect(() => {
    const applyTheme = () => {
      const next = theme === "system" ? getSystemTheme() : theme;
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      setResolvedTheme(next);
    };

    applyTheme();

    if (theme !== "system") return;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", applyTheme);
    return () => query.removeEventListener("change", applyTheme);
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (private browsing, blocked cookies).
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
