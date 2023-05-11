import type { Widget as WidgetModel } from "@prisma/client";

import type { DashboardModel } from "@/types/dashboard.type";
import type { SectionModel } from "@/types/section.type";
import { Widget } from "@/components/dashboard/views/Widget";
import { Section } from "@/components/dashboard/views/Section";

export function Dashboard({
  dashboard,
}: {
  dashboard: DashboardModel;
}): JSX.Element {
  return (
    <>
      {dashboard.sections.map((section: SectionModel) => (
        <Section key={section.id} data={section}>
          {section.widgets.map((widget: WidgetModel) => (
            <Widget key={widget.id} dashboardId={dashboard.id} data={widget} />
          ))}
        </Section>
      ))}
    </>
  );
}
