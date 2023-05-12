"use server";
import type { DashboardModel } from "@/types/dashboard.type";
import type { SectionModel } from "@/types/section.type";
import { Section } from "@/components/dashboard/views/Section";

export async function Dashboard({
  dashboard,
}: {
  dashboard: DashboardModel;
}): Promise<JSX.Element> {
  return (
    <>
      {dashboard.sections.map((section: SectionModel) => (
        <Section key={section.id} data={section} />
      ))}
    </>
  );
}
