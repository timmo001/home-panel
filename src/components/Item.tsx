"use client";
import { CardBase } from "@/components/cards/Base";
import { CardMarkdown } from "@/components/cards/Markdown";

export function Item({ title }: { title?: string }): JSX.Element {
  return (
    <CardBase title={title}>
      <CardMarkdown content="Hello" />
    </CardBase>
  );
}
