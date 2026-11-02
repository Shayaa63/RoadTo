import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '../types';
import { lasTema, sparaTema } from '../lib/lokalLagring';

interface ThemeContextVarde {
  theme: Theme;
  vaxlaTema: () => void;
}

const ThemeContext = createContext<ThemeContextVarde | undefined>(undefined);

// Startvärde: sparat val, annars systemets inställning
function hamtaStartTema(): Theme {
  const sparat = lasTema();
  if (sparat) return sparat;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(hamtaStartTema);

  // Uppdatera <html>-klassen och spara valet varje gång temat ändras
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    sparaTema(theme);
  }, [theme]);

  const vaxlaTema = useCallback(() => {
    setTheme((tidigare) => (tidigare === 'dark' ? 'light' : 'dark'));
  }, []);

  const varde = useMemo(() => ({ theme, vaxlaTema }), [theme, vaxlaTema]);

  return <ThemeContext.Provider value={varde}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextVarde {
  const kontext = useContext(ThemeContext);
  if (!kontext) {
    throw new Error('useTheme måste användas inuti en ThemeProvider');
  }
  return kontext;
}