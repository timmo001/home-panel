"use client";
import type { WidgetFrame as WidgetFrameModel } from "@prisma/client";

import type { WidgetModel } from "@/types/widget.type";

export function WidgetFrame({
  widget,
}: {
  widget: WidgetModel<WidgetFrameModel>;
}): JSX.Element {
  const { height, url } = widget.data;
  return (
    <iframe
      src={url}
      width="100%"
      height={height || "100%"}
      style={{
        backgroundColor: "transparent",
        border: "none",
      }}
    />
  );
}
