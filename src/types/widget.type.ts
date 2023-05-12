import type { Section, Widget } from "@prisma/client";

// Combined types for widget with section
export type WidgetWithSectionModel = Widget & {
  section: Section;
};

export enum WidgetType {
  Checklist = "checklist",
  Frame = "frame",
  HomeAssistant = "homeAssistant",
  Image = "image",
  Markdown = "markdown",
  News = "news",
  RSS = "rss",
}
