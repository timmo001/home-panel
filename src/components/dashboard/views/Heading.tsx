"use client";
import { HeaderItem as HeaderItemModel } from "@prisma/client";
import { Unstable_Grid2 as Grid2, Typography } from "@mui/material";
import Moment from "react-moment";

import type { DashboardModel } from "@/types/dashboard.type";
import { HeaderItemType } from "@/types/dashboard.type";

function HeaderItem({ item }: { item: HeaderItemModel }): JSX.Element | null {
  switch (item.type) {
    case HeaderItemType.DateTime:
      return (
        <>
          <Typography
            align="center"
            variant="h2"
            sx={{ lineHeight: "1.0", fontWeight: 300 }}
          >
            <Moment format="h:mm a" />
          </Typography>
          <Typography
            align="center"
            variant="h4"
            sx={{ lineHeight: "1.2", fontWeight: 300 }}
          >
            <Moment format="dddd, Do MMMM YYYY" />
          </Typography>
        </>
      );
    case HeaderItemType.Date:
      return (
        <Typography
          align="center"
          variant="h2"
          sx={{ lineHeight: "1.0", fontWeight: 300 }}
        >
          <Moment format="Do MMMM YYYY" />
        </Typography>
      );
    case HeaderItemType.Time:
      return (
        <Typography
          align="center"
          variant="h2"
          sx={{ lineHeight: "1.0", fontWeight: 300 }}
        >
          <Moment format="HH:mm" />
        </Typography>
      );
    default:
      return null;
  }
}

export function Heading({
  dashboard,
}: {
  dashboard: DashboardModel;
}): JSX.Element {
  return (
    <Grid2
      component="header"
      container
      justifyContent="space-evenly"
      wrap="nowrap"
      xs
      sx={{ width: "100%" }}
    >
      {dashboard.headerItems.map((item: HeaderItemModel) => (
        <Grid2 key={item.id} justifyContent="center">
          <HeaderItem item={item} />
        </Grid2>
      ))}
    </Grid2>
  );
}
