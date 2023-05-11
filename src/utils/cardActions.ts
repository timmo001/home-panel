"use server";
import { revalidatePath } from "next/cache";

import type { CardData } from "@/types/card.type";

export async function cardCreate(data: CardData): Promise<void> {
  console.log("Create card:", data);
  revalidatePath(`/dashboard/edit/items/${data.id}`);
}

export async function cardDelete(data: CardData): Promise<void> {
  console.log("Delete card:", data);
}

export async function cardUpdate(data: CardData): Promise<void> {
  console.log("Update card:", data);
  revalidatePath(`/dashboard/edit/items/${data.id}`);
}
