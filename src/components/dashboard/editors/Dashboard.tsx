"use client";
import type {
  Dashboard as DashboardModel,
  HeaderItem as HeaderItemModel,
  HomeAssistant as HomeAssistantModel,
} from "@prisma/client";
import {
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Unstable_Grid2 as Grid2,
  Button,
} from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  dashboardDelete,
  dashboardHeaderUpdate,
  dashboardUpdate,
} from "@/utils/serverActions/dashboard";
import { DeleteRounded } from "@mui/icons-material";
import { homeAssistantUpdateConfig } from "@/utils/serverActions/homeAssistant";

export function EditDashboard({
  dashboardConfig,
  headerItemsConfig,
  homeAssistantConfig,
}: {
  dashboardConfig: DashboardModel;
  headerItemsConfig: Array<HeaderItemModel>;
  homeAssistantConfig: HomeAssistantModel;
}): JSX.Element {
  const router = useRouter();

  const headerItems = useMemo<Array<string>>(
    () => headerItemsConfig.map((item) => item.type),
    [headerItemsConfig]
  );

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
        width: "100%",
        margin: "2.5rem 2.5rem 0",
      }}
    >
      <CardContent>
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
          <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
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
          <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Typography variant="h6" gutterBottom>
            Header Items
          </Typography>
          <MuiChipsInput
            name="headerItems"
            label="Header Items"
            margin="dense"
            value={headerItems}
            helperText={
              headerItems.length > 0 ? "Double click to edit an item" : ""
            }
            onChange={async (data: Array<string>) => {
              await dashboardHeaderUpdate(dashboardConfig.id, data);
            }}
          />
          <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Button
            color="error"
            variant="outlined"
            onClick={async () => {
              await dashboardDelete(dashboardConfig.id);
              router.replace("/dashboards");
            }}
            sx={{ marginTop: "1rem" }}
          >
            <DeleteRounded />
            Delete
          </Button>
        </Grid2>
      </CardContent>
    </Card>
  );
}
