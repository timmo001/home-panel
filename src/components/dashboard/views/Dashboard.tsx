"use client";
import { Unstable_Grid2 as Grid2, Stack } from "@mui/material";

import type { DashboardModel } from "@/types/dashboard.type";
import type { SectionModel } from "@/types/section.type";
import { Heading } from "@/components/dashboard/views/Heading";
import { HomeAssistantProvider } from "@/providers/HomeAssistantProvider";
import { Section } from "@/components/dashboard/views/Section";

export function Dashboard({
  dashboard,
}: {
  dashboard: DashboardModel;
}): JSX.Element {
  return (
    <HomeAssistantProvider dashboardId={dashboard.id}>
      <Stack
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          maxHeight: "100%",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <Heading dashboard={dashboard} />
        <Grid2
          container
          direction="column"
          alignContent="flex-start"
          sx={{
            overflowX: "auto",
            overflowY: "clip",
            width: "100%",
            height: "100%",
            maxHeight: "100%",
          }}
        >
          {dashboard.sections.map((section: SectionModel) => (
            <Section key={section.id} data={section} />
          ))}
        </Grid2>
      </Stack>
    </HomeAssistantProvider>
  );
}
