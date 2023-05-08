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
      <Stack direction="column" spacing={2}>
        <Typography component="h5" variant="h2">
          Something went wrong!
        </Typography>
        <Button variant="contained" onClick={() => reset()}>
          Try again
        </Button>
      </Stack>
    </main>
  );
}
