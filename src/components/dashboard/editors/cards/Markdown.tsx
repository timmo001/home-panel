"use client";
import { TextField } from "@mui/material";

import type { CardData } from "@/types/card.type";
import { cardUpdate } from "@/utils/cardActions";

export function EditCardMarkdown({ data }: { data: CardData }): JSX.Element {
  return (
    <>
      <TextField
        name="content"
        label="Content"
        margin="dense"
        defaultValue={data.content}
        onChange={async (e) =>
          await cardUpdate({ ...data, [e.target.name]: e.target.value })
        }
      />
    </>
  );
}
