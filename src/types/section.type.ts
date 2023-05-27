import type { Section } from "@prisma/client";

import { WidgetModel } from "@/types/widget.type";

// Combined types for section and widget
export type SectionModel = Section & {
  widgets: Array<WidgetModel>;
};

export enum SectionAction {
  Delete = "delete",
  Edit = "edit",
  MoveDown = "moveDown",
  MoveUp = "moveUp",
}
