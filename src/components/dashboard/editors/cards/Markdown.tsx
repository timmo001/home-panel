"use client";
import { useState } from "react";
import { TextField } from "@mui/material";

type Data = { content: string };

export function EditCardMarkdown({ dataIn }: { dataIn: Data }): JSX.Element {
  const [data, setData] = useState<Data>(dataIn);

  function handleTextFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

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
