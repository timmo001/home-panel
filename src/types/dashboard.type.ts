import type { Dashboard, HeaderItem, Section, Widget } from "@prisma/client";

// Combined types for dashboard, section and widget
export type DashboardModel = Dashboard & {
  headerItems: Array<HeaderItem>;
  sections: Array<
    Section & {
      widgets: Array<Widget>;
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
