"use server";
import type { DashboardModel } from "@/types/dashboard.type";
import type { SectionModel } from "@/types/section.type";
import { HomeAssistantProvider } from "@/providers/HomeAssistantProvider";
import { Section } from "@/components/dashboard/views/Section";

export async function Dashboard({
  dashboard,
}: {
  dashboard: DashboardModel;
}): Promise<JSX.Element> {
  return (
    <HomeAssistantProvider dashboardId={dashboard.id}>
      <>
        {dashboard.sections.map((section: SectionModel) => (
          <Section key={section.id} data={section} />
        ))}
      </>
    </HomeAssistantProvider>
  );
}
