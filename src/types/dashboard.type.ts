import type { Dashboard, Section, Widget } from "@prisma/client";

// Combined types for dashboard, section and widget
export type DashboardModel = Dashboard & {
  sections: Array<
    Section & {
      widgets: Array<Widget>;
    }
  >;
};
