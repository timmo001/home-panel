"use client";
import { useState } from "react";
import { TextField } from "@mui/material";

type Data = { title: string };

export function EditCardBase({ dataIn }: { dataIn: Data }): JSX.Element {
  const [data, setData] = useState<Data>(dataIn);

  function handleTextFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  return (
    <>
      <TextField
        label="Title"
        name="title"
        value={data.title}
        onChange={handleTextFieldChange}
      />
    </>
  );
}
