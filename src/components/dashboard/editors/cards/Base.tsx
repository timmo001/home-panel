"use client";
import { TextField } from "@mui/material";

type Data = { title: string };

export function EditCardBase({
  data,
  handleTextFieldChange,
}: {
  data: Data;
  handleTextFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <>
      <TextField
        name="title"
        label="Title"
        margin="dense"
        value={data.title}
        onChange={handleTextFieldChange}
      />
    </>
  );
}
