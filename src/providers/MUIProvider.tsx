"use client";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import { ReactNode } from "react";

import { theme } from "@/utils/theme";
import styles from "@/app/page.module.css";

export function MUIProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <>
      <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Box component="main" className={styles.main} sx={{ flexGrow: 1 }}>
              {children}
            </Box>
          </Box>
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </>
  );
}
