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
        <Item title="Item 09" />
        <Item title="Item 10" />
        <Item />
        <Item />
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
        <Item />
        <Item />
      </Section>
      <Section title="Section 03">
        <Item title="Item 01" />
        <Item title="Item 02" />
        <Item title="Item 03" />
        <Item title="Item 04" />
        <Item title="Item 05" />
        <Item title="Item 06" />
        <Item />
        <Item />
      </Section>
      <Section title="Section 04">
        <Item title="Item 01" />
        <Item title="Item 02" />
        <Item title="Item 03" />
        <Item title="Item 04" />
        <Item />
        <Item />
      </Section>
      <Section title="Section 05">
        <Item title="Item 01" />
        <Item title="Item 02" />
        <Item />
        <Item />
      </Section>
      <Section title="Section 06">
        <Item title="Item 01" />
        <Item />
      </Section>
      <Section>
        <Item />
        <Item />
      </Section>
    </>
  );
}
