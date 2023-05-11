import type { Section, Widget } from "@prisma/client";

// Combined types for widget with section
export type WidgetWithSectionModel = Widget & {
  section: Section;
};
