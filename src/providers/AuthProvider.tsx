"use client";
import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <SessionProvider>{children}</SessionProvider>;
}
