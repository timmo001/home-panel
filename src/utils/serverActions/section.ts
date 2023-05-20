"use server";
import type { Section } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/utils/prisma";

export async function sectionCreate(dashboardId: string): Promise<Section> {
  console.log("Create section:", { dashboardId });

  const newData = await prisma.section.create({
    data: {
      title: "Section",
      subtitle: "New section",
      width: "480px",
      dashboard: {
        connect: {
          id: dashboardId,
        },
      },
    },
  });

  await sectionsReorganise(dashboardId);

  revalidatePath(`/dashboards/${dashboardId}`);
  revalidatePath(`/dashboards/${dashboardId}/sections/${newData.id}/edit`);

  return newData;
}

export async function sectionDelete(
  dashboardId: string,
  id: string
): Promise<Section> {
  console.log("Delete section:", { id });

  const data = await prisma.section.delete({
    where: { id },
  });

  revalidatePath(`/dashboards/${dashboardId}`);

  return data;
}

export async function sectionsReorganise(dashboardId: string): Promise<void> {
  console.log("Reorganise sections:", { dashboardId });

  const sections = await prisma.section.findMany({
    select: { id: true },
    where: { dashboardId },
    orderBy: { position: "asc" },
  });

  // Reorganise section positions in 10s
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const newPosition = i * 10;
    console.log("Reorganise section:", {
      index: i,
      id: section.id,
      newPosition,
    });
    await prisma.section.update({
      data: { position: newPosition },
      where: { id: section.id },
    });
  }
}

export async function sectionUpdate(
  dashboardId: string,
  sectionId: string,
  name: string,
  value: any
): Promise<Section> {
  console.log("Update section:", dashboardId, sectionId, name, value);

  let newData = await prisma.section.update({
    data: {
      [name]: value,
    },
    where: {
      id: sectionId,
    },
  });

  if (name === "position") {
    await sectionsReorganise(newData.dashboardId);
    newData = await prisma.section.findUniqueOrThrow({
      where: { id: sectionId },
    });
  }

  revalidatePath(`/dashboards/${dashboardId}`);
  revalidatePath(`/dashboards/${dashboardId}/sections/${newData.id}/edit`);

  console.log("New section data:", newData);

  return newData;
}
