"use client";
import type {
  Dashboard as DashboardModel,
  HomeAssistant as HomeAssistantModel,
} from "@prisma/client";
import {
  Typography,
  Card,
  CardContent,
  Unstable_Grid2 as Grid2,
  TextField,
} from "@mui/material";

import { dashboardUpdate } from "@/utils/serverActions/dashboard";
import { homeAssistantUpdateConfig } from "@/utils/serverActions/homeAssistant";

export function EditDashboard({
  dashboardConfig,
  homeAssistantConfig,
}: {
  dashboardConfig: DashboardModel;
  homeAssistantConfig: HomeAssistantModel;
}): JSX.Element {
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
            defaultValue={dashboardConfig.name}
            onChange={async (e) =>
              await dashboardUpdate(
                dashboardConfig.id,
                e.target.name,
                e.target.value
              )
            }
          />
          <TextField
            name="description"
            label="Description"
            margin="dense"
            defaultValue={dashboardConfig.description}
            onChange={async (e) =>
              await dashboardUpdate(
                dashboardConfig.id,
                e.target.name,
                e.target.value
              )
            }
          />
          <Typography variant="h6" gutterBottom>
            Home Assistant
          </Typography>
          <TextField
            name="url"
            label="URL"
            margin="dense"
            defaultValue={homeAssistantConfig.url}
            onChange={async (e) =>
              await homeAssistantUpdateConfig(dashboardConfig.id, {
                [e.target.name]: e.target.value,
              })
            }
          />
        </Grid2>
      </CardContent>
    </Card>
  );
}
