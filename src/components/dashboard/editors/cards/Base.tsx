"use client";
import { TextField } from "@mui/material";

import type { CardData } from "@/types/card.type";
import { cardUpdate } from "@/utils/cardActions";

export function EditCardBase({ data }: { data: CardData }): JSX.Element {
  return (
    <>
      <TextField
        name="title"
        label="Title"
        margin="dense"
        defaultValue={data.title}
        onChange={async (e) =>
          await cardUpdate({ ...data, [e.target.name]: e.target.value })
        }
      />
    </>
  );
}
