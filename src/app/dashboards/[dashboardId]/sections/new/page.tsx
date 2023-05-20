import type { User as UserModel } from "@prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/AccessDenied";
import { sectionCreate } from "@/utils/serverActions/section";
import { prisma } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "New Section | Home Panel",
  description: "New Section - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { sectionId: string };
}): Promise<JSX.Element> {
  console.log("New Section:", params);

  const session = await getServerSession();
  if (!session) return <AccessDenied />;

  const user: UserModel = await prisma.user.findUniqueOrThrow({
    where: {
      username: session.user!.email!,
    },
  });

  const newSection = await sectionCreate(user.id);

  return redirect(`/sections/${newSection.id}/edit`);
}
