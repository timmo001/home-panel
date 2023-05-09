"use client";
import { CardBase } from "@/views/cards/Base";
import { CardMarkdown } from "@/views/cards/Markdown";

export function Item({ title }: { title?: string }): JSX.Element {

  return (
    <CardBase title={title}>
      <CardMarkdown content="Hello" />
    </CardBase>
  );
}
