"use client";
import type { Dashboard as DashboardModel } from "@prisma/client";
import {
  Typography,
  Card,
  CardContent,
  Unstable_Grid2 as Grid2,
  TextField,
} from "@mui/material";

import { dashboardUpdate } from "@/utils/serverActions/dashboard";

export function EditDashboard({ data }: { data: DashboardModel }): JSX.Element {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5">Edit Dashboard</Typography>
        <Grid2 container direction="column" sx={{ marginTop: "1rem" }}>
          <TextField
            name="name"
            label="Name"
            margin="dense"
            defaultValue={data.name}
            onChange={async (e) =>
              await dashboardUpdate(data.id, e.target.name, e.target.value)
            }
          />
          <TextField
            name="description"
            label="Description"
            margin="dense"
            defaultValue={data.description}
            onChange={async (e) =>
              await dashboardUpdate(data.id, e.target.name, e.target.value)
            }
          />
        </Grid2>
      </CardContent>
    </Card>
  );
}
