"use client";
import { useLongPress } from "use-long-press";
import { ButtonBase, Card, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export function WidgetBase({
  children,
  dashboardId,
  sectionId,
  widgetId,
  title,
}: {
  children: Array<JSX.Element> | JSX.Element;
  dashboardId: string;
  sectionId: string;
  widgetId: string;
  title?: string | null;
}): JSX.Element {
  const longPress = useLongPress(handleOpenWidgetEdit);
  const path = usePathname();
  const router = useRouter();

  function handleOpenWidgetEdit(): void {
    router.push(
      `/dashboards/${dashboardId}/sections/${sectionId}/widgets/${widgetId}/edit`
    );
  }

  const disabled = path.endsWith("edit");

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
