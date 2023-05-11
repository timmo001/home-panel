"use server";
import type { Widget as WidgetModel } from "@prisma/client";

import { WidgetBase } from "@/components/dashboard/views/widgets/Base";
import { widgetGetData } from "@/utils/widgetActions";
import { WidgetMarkdown } from "@/components/dashboard/views/widgets/Markdown";

export async function Widget({
  dashboardId,
  sectionId,
  data,
}: {
  dashboardId: string;
  sectionId: string;
  data: WidgetModel;
}): Promise<JSX.Element> {
  let widgetView: JSX.Element;

  const widgetData: any = await widgetGetData(data.id, data.type);

  switch (data.type) {
    case "markdown":
      widgetView = <WidgetMarkdown data={widgetData} />;
      break;
    default:
      widgetView = <div>Unknown widget type</div>;
      break;
  }

  return (
    <WidgetBase
      dashboardId={dashboardId}
      sectionId={data.sectionId}
      widgetId={data.id}
      title={data.title}
    >
      {widgetView}
    </WidgetBase>
  );
}
