"use client";
import { TextField } from "@mui/material";

type Data = { content: string };

export function EditCardMarkdown({
  data,
  handleTextFieldChange,
}: {
  data: Data;
  handleTextFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <>
      <TextField
        name="content"
        label="Content"
        margin="dense"
        value={data.content}
        onChange={handleTextFieldChange}
      />
    </>
  );
}
