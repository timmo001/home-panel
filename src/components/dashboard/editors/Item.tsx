"use client";
import { ButtonBase } from "@mui/material";
import Link from "next/link";

import { CardBase } from "@/components/dashboard/views/cards/Base";
import { CardMarkdown } from "@/components/dashboard/views/cards/Markdown";

export function EditItem({ title }: { title?: string }): JSX.Element {
  return (
    <Link href={`/dashboard/edit/item/${"abc123"}`}>
      <ButtonBase>
        <CardBase title={title}>
          <CardMarkdown content="Hi" />
        </CardBase>
      </ButtonBase>
    </Link>
  );
}
