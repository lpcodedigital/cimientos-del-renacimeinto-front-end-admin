import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference
  );

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  const setColorMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  // 1. Definimos el tema personalizado
  const customTheme = createTheme({
    ...RefineThemes.Blue, // Copiamos la base de Refine (tipografía, etc.)
    palette: {
      ...RefineThemes.Blue.palette,
      mode: mode as "light" | "dark",
      primary: {
        main: "#901b45", // <--- TU COLOR INSTITUCIONAL (Vino / Yucatán)
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#d4a373", // <--- COLOR DE ACENTO (Mostaza / Caramelo)
      },
    },
  });

  const customThemeDark = createTheme({
    ...RefineThemes.BlueDark,
    palette: {
      ...RefineThemes.BlueDark.palette,
      mode: "dark",
      primary: {
        main: "#c6943d", // Color un poco más brillante para el modo oscuro
      },
    },
  });

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider
        // you can change the theme colors here. example: mode === "light" ? RefineThemes.Magenta : RefineThemes.MagentaDark
        theme={mode === "light" ? customTheme : customThemeDark}
      >
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
