"use client";
import { Item } from "@/components/Item";
import { Section } from "@/components/Section";

export function Dashboard(): JSX.Element {
  return (
    <Section title="Section 01">
      <Item title="Item 01" />
      <Item title="Item 02" />
    </Section>
  );
}
