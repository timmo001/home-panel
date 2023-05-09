import { EditItem } from "@/EditItem";
import { EditSection } from "@/EditSection";

export function EditDashboard(): JSX.Element {
  return (
    <>
      <EditSection title="Section 01">
        <EditItem title="Item 01" />
        <EditItem title="Item 02" />
        <EditItem title="Item 03" />
        <EditItem title="Item 04" />
        <EditItem title="Item 05" />
        <EditItem title="Item 06" />
        <EditItem title="Item 07" />
        <EditItem title="Item 08" />
        <EditItem title="Item 09" />
        <EditItem title="Item 10" />
        <EditItem />
        <EditItem />
      </EditSection>
      <EditSection title="Section 02">
        <EditItem title="Item 01" />
        <EditItem title="Item 02" />
        <EditItem title="Item 03" />
        <EditItem title="Item 04" />
        <EditItem title="Item 05" />
        <EditItem title="Item 06" />
        <EditItem title="Item 07" />
        <EditItem title="Item 08" />
        <EditItem />
        <EditItem />
      </EditSection>
      <EditSection title="Section 03">
        <EditItem title="Item 01" />
        <EditItem title="Item 02" />
        <EditItem title="Item 03" />
        <EditItem title="Item 04" />
        <EditItem title="Item 05" />
        <EditItem title="Item 06" />
        <EditItem />
        <EditItem />
      </EditSection>
      <EditSection title="Section 04">
        <EditItem title="Item 01" />
        <EditItem title="Item 02" />
        <EditItem title="Item 03" />
        <EditItem title="Item 04" />
        <EditItem />
        <EditItem />
      </EditSection>
  );
}
