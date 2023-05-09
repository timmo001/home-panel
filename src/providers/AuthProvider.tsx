"use client";
import type { ReactNode } from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}): JSX.Element {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
