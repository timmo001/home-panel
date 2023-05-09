import { Item } from "@/components/dashboard/views/Item";
import { Section } from "@/components/dashboard/views/Section";

export function Dashboard(): JSX.Element {
  const data = {
    id: "abc123",
    title: "Item 01",
    content: "Hello",
  };

  return (
    <>
      <Section title="Section 01">
        <Item data={data} />
        <Item data={data} />
        <Item data={data} />
        <Item data={data} />
        <Item />
        <Item />
      </Section>
      <Section title="Section 02">
        <Item data={data} />
        <Item data={data} />
        <Item />
        <Item />
      </Section>
    </>
  );
}
