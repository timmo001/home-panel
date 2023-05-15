import type { Section, Widget } from "@prisma/client";

// Combined types for section and widget
export type SectionModel = Section & {
  widgets: Array<Widget>;
};

export enum SectionAction {
  Delete = "delete",
  Edit = "edit",
  MoveDown = "moveDown",
  MoveUp = "moveUp",
}
