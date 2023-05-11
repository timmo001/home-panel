"use client";
import type { Widget as WidgetModel } from "@prisma/client";

import { CardBase } from "@/components/dashboard/views/cards/Base";
// import { CardMarkdown } from "@/components/dashboard/views/cards/Markdown";

export function Widget({
  dashboardId,
  data,
}: {
  dashboardId: string;
  data: WidgetModel;
}): JSX.Element {
  return (
    <CardBase
      dashboardId={dashboardId}
      sectionId={data.sectionId}
      widgetId={data.id}
      title={data.title}
    >
      {/* data.widgetType */}
      {/* <CardMarkdown content={data.content} /> */}
    </CardBase>
  );
}
