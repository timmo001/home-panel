import type { Metadata } from "next";

import type { CardData } from "@/types/card.type";
import { EditItem } from "@/components/dashboard/editors/Item";

export const metadata: Metadata = {
  title: "Edit Item | Home Panel",
  description: "Edit Item - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const data: CardData = {
    id: params.id,
    title: "Item 01",
    content: "Hello",
  };

  return <EditItem data={data} />;
}
