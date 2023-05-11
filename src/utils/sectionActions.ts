"use server";
import type { Section } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/utils/prisma";

export async function sectionDelete(
  idOrSection: string | Section
): Promise<Section> {
  console.log("Delete section:", idOrSection);

  return await prisma.section.delete({
    where: {
      id: typeof idOrSection === "string" ? idOrSection : idOrSection.id,
    },
  });
}

export async function sectionUpdate(
  dashboardId: string,
  sectionId: string,
  name: string,
  value: any
): Promise<Section> {
  console.log("Update section:", dashboardId, sectionId, name, value);

  const newData = await prisma.section.update({
    data: {
      [name]: value,
    },
    where: {
      id: sectionId,
    },
  });

  revalidatePath(`/dashboards/${dashboardId}/sections/${newData.id}/edit`);

  return newData;
}
