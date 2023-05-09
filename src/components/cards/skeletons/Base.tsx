"use client";
import { Card, Skeleton } from "@mui/material";

export function SkeletonCardBaseStandard({
  children,
}: {
  children: Array<JSX.Element> | JSX.Element;
}): JSX.Element {
  return (
    <Card
      sx={{
        padding: "0.4rem",
        width: "100%",
      }}
    >
      <Skeleton variant="text" />
      {children}
    </Card>
  );
}
