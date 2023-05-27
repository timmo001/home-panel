import type {
  Section,
  Widget,
  WidgetChecklist,
  WidgetChecklistItem,
} from "@prisma/client";

// Combined types for widget and generic widget data
export type WidgetModel<T = any> = Widget & {
  data: T;
};

export enum WidgetAction {
  Delete = "delete",
  Edit = "edit",
  MoveDown = "moveDown",
  MoveUp = "moveUp",
  ToggleExpanded = "toggleExpanded",
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

export type WidgetChecklistModel = WidgetChecklist & {
  items: Array<WidgetChecklistItem>;
};
