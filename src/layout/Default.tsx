import { createContext, useMemo, useState } from "react";

import { Box, Button, Stack } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { FCProps } from "@/types";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const DefaultLayout: React.FC<FCProps> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  //   useEffect(() => {
  //     const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)")
  //       .matches
  //       ? "dark"
  //       : "light";
  //   }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Stack
          flexDirection="column"
          sx={{
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "background.default",
            color: "text.primary",
          }}
        >
          <Button onClick={colorMode.toggleColorMode}>{mode}</Button>
          {children}
        </Stack>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default DefaultLayout;
