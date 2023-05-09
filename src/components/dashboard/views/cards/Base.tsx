"use client";
import { useLongPress } from "use-long-press";
import { ButtonBase, Card, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export function CardBase({
  children,
  id,
  title,
}: {
  children: Array<JSX.Element> | JSX.Element;
  id: string;
  title?: string;
}): JSX.Element {
  const longPress = useLongPress(handleOpenItem);
  const path = usePathname();
  const router = useRouter();

  function handleOpenItem(): void {
    router.push(`/dashboard/edit/items/${id}`);
  }

  const disabled = path !== "/dashboard";

  return (
    <>
      <ButtonBase
        disabled={disabled}
        {...(!disabled && longPress())}
        sx={{
          textAlign: "left",
          width: "100%",
        }}
      >
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
