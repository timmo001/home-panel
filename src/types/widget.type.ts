import type { Section, Widget } from "@prisma/client";

// Combined types for widget with section
export type WidgetWithSectionModel = Widget & {
  section: Section;
};

export enum WidgetAction {
  Activate = "activate",
  Delete = "delete",
  Edit = "edit",
  MoveDown = "moveDown",
  MoveUp = "moveUp",
}

export enum WidgetType {
  Checklist = "checklist",
  Frame = "frame",
  HomeAssistant = "homeAssistant",
  Image = "image",
  Markdown = "markdown",
  News = "news",
  RSS = "rss",
}
