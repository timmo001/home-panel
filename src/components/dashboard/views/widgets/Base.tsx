"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import { Box, ButtonBase, Card, Typography } from "@mui/material";
import { useLongPress } from "use-long-press";
import { usePathname, useRouter } from "next/navigation";
import { WidgetType } from "@/types/widget.type";

export function WidgetBase({
  children,
  dashboardId,
  data,
}: {
  children: Array<JSX.Element> | JSX.Element;
  dashboardId: string;
  data: WidgetModel;
}): JSX.Element {
  const longPress = useLongPress(handleOpenWidgetEdit);
  const path = usePathname();
  const router = useRouter();

  function handleOpenWidgetEdit(): void {
    router.push(
      `/dashboards/${dashboardId}/sections/${data.sectionId}/widgets/${data.id}/edit`
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
        <Card sx={{ width: "100%" }}>
          {data.title && (
            <Typography variant="h6" sx={{ margin: "0.2rem 0.4rem 0.2rem" }}>
              {data.title}
            </Typography>
          )}
          <Box
            sx={{
              padding:
                data.type === WidgetType.Image
                  ? 0
                  : data.title
                  ? "0 0.4rem 0.4rem"
                  : "0.4rem",
            }}
          >
            {children}
          </Box>
        </Card>
      </ButtonBase>
    </>
  );
}
