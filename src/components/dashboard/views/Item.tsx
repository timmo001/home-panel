"use client";
import { CardBase } from "@/components/dashboard/views/cards/Base";
import { CardMarkdown } from "@/components/dashboard/views/cards/Markdown";

export function Item({ data }: { data?: any }): JSX.Element {
  return (
    <CardBase id={data?.id} title={data?.title}>
      <CardMarkdown content={data?.content} />
    </CardBase>
  );
}
