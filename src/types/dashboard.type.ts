import type { Dashboard, HeaderItem, Section } from "@prisma/client";

import type { WidgetModel } from "@/types/widget.type";

// Combined types for dashboard, section and widget
export type DashboardModel = Dashboard & {
  headerItems: Array<HeaderItem>;
  sections: Array<
    Section & {
      widgets: Array<WidgetModel>;
    }
  >;
};

export type DashboardHeaderModel = Dashboard & {
  headerItems: Array<HeaderItem>;
};

export enum HeaderItemType {
  Date = "date",
  DateTime = "dateTime",
  Spacer = "spacer",
  Time = "time",
}
