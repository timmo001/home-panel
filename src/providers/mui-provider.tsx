"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import { ReactNode } from "react";

import { theme } from "@/utils/theme";

export const MuiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </>
  );
};
