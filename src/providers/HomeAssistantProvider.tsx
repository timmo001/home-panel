"use client";
import type { ReactNode } from "react";

export function HomeAssistantProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <>{children}</>;
}
