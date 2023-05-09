import { Item } from "@/components/dashboard/views/Item";
import { Section } from "@/components/dashboard/views/Section";

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
        <Item />
        <Item />
      </Section>
      <Section title="Section 02">
        <Item title="Item 01" />
        <Item title="Item 02" />
        <Item title="Item 03" />
        <Item />
        <Item />
      </Section>
    </>
  );
}
