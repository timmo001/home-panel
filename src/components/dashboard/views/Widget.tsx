"use server";
import type {
  Widget as WidgetModel,
  WidgetMarkdown as WidgetMarkdownModel,
} from "@prisma/client";

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
  switch (data.type) {
    case "markdown":
      widgetView = (
        <WidgetMarkdown
          data={(await widgetGetData(data)) as WidgetMarkdownModel}
        />
      );
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
