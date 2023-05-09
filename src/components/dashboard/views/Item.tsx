"use client";
import { CardBase } from "@/components/dashboard/views/cards/Base";
import { CardMarkdown } from "@/components/dashboard/views/cards/Markdown";

export function Item({ title }: { title?: string }): JSX.Element {

  return (
    <CardBase title={title}>
      <CardMarkdown content="Hello" />
    </CardBase>
  );
}
