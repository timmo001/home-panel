"use client";
import { CardBaseStandard } from "@/components/cards/Base";
import { CardMarkdown } from "@/components/cards/Markdown";

export function Item({ title }: { title: string }): JSX.Element {
  return (
    <CardBaseStandard title={title}>
      <CardMarkdown content="Hello" />
    </CardBaseStandard>
  );
}
