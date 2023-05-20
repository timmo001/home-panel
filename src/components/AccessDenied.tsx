"use client";
import { Button, Stack, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

export function AccessDenied(): JSX.Element {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        margin: "2.5rem 2.5rem 0",
        width: "100%",
      }}
    >
      <Typography align="center" component="h2" variant="h2">
        Access Denied
      </Typography>
      <Button variant="contained" onClick={() => signIn()}>
        Sign in
      </Button>
    </Stack>
  );
}
