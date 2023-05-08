import { Item } from "@/components/Item";
import { Section } from "@/components/Section";

export function Dashboard(): JSX.Element {
  return (
    <>
      <Section title="Section 01">
        <Item title="Item 01" />
        <Item title="Item 02" />
        <Item title="Item 03" />
        <Item title="Item 04" />
        <Item title="Item 05" />
        <Item title="Item 06" />
        <Item title="Item 07" />
        <Item title="Item 08" />
      </Section>
      <Section title="Section 02">
        <Item title="Item 01" />
        <Item title="Item 02" />
        <Item title="Item 03" />
        <Item title="Item 04" />
        <Item title="Item 05" />
        <Item title="Item 06" />
        <Item title="Item 07" />
        <Item title="Item 08" />
      </Section>
    </>
  );
}
