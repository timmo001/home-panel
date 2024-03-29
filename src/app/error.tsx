"use client";
import { useEffect } from "react";

import styles from "@/app/page.module.css";
import { Button, Stack, Typography } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error, reset]);

  return (
    <main className={styles.main}>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          margin: "2.5rem 2.5rem 0",
          width: "100%",
        }}
      >
        <Typography align="center" component="h2" variant="h2">
          Something went wrong!
        </Typography>
        <Button variant="contained" onClick={() => reset()}>
          Try again
        </Button>
      </Stack>
    </main>
  );
}
