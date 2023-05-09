"use client";
import { useLongPress } from "use-long-press";
import { ButtonBase, Card, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export function CardBase({
  children,
  title,
}: {
  children: Array<JSX.Element> | JSX.Element;
  title?: string;
}): JSX.Element {
  const longPress = useLongPress(handleOpenItem);
  const router = useRouter();

  function handleOpenItem(): void {
    router.push(`/dashboard/items/${"abc123"}`);
  }

  return (
    <>
      <ButtonBase {...longPress()}>
        <Card
          sx={{
            padding: title ? "0.2rem 0.4rem 0.4rem" : "0.4rem",
            width: "100%",
          }}
        >
          {title && <Typography variant="h6">{title}</Typography>}
          {children}
        </Card>
      </ButtonBase>
    </>
  );
}
