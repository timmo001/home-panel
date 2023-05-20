"use client";
import type { WidgetFrame as WidgetFrameModel } from "@prisma/client";

export function WidgetFrame({ data }: { data: WidgetFrameModel }): JSX.Element {
  return (
    <iframe
      src={data.url}
      width="100%"
      height={data.height || "100%"}
      style={{
        backgroundColor: "transparent",
        border: "none",
      }}
    />
  );
}
