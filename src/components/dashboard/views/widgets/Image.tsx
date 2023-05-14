"use client";
import type { WidgetImage as WidgetImageModel } from "@prisma/client";

export function WidgetImage({ data }: { data: WidgetImageModel }): JSX.Element {
  return (
    <>
      {data.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={data.url} src={data.url} width="100%" />
      )}
    </>
  );
}
