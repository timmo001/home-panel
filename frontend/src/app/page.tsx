"use client";
import { useState } from "react";
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  responsiveFontSizes,
  Theme,
  ThemeProvider,
} from "@mui/material/styles";

import { defaultPalette } from "@/config/defaults";

export default function Home() {
  const [theme, setTheme] = useState<Theme>(
    responsiveFontSizes(
      createTheme({
        palette: defaultPalette,
      })
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main></main>
    </ThemeProvider>
  );
}
