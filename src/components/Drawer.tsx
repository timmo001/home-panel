"use client";
import type { Dashboard as DashboardModel } from "@prisma/client";
import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AddRounded,
  ArrowBackRounded,
  DashboardRounded,
  MenuRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export function DrawerComponent({
  dashboards,
}: {
  dashboards: Array<DashboardModel>;
}): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const dashboardPath =
    pathname.startsWith("/dashboards") &&
    pathname.split("/").slice(0, 3).join("/");

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "transparent",
          left: drawerOpen ? 260 : 0,
          top: 0,
          width: "fit-content",
        }}
        elevation={0}
      >
        <Toolbar
          variant="dense"
          sx={{
            paddingLeft: "0.2rem !important",
            paddingRight: "0 !important",
          }}
        >
          {pathname.endsWith("/edit") ? (
            <IconButton aria-label="Go Back" onClick={() => router.back()}>
              <ArrowBackRounded />
            </IconButton>
          ) : (
            !drawerOpen && (
              <IconButton
                aria-label="Open drawer"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <MenuRounded />
              </IconButton>
            )
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        variant="persistent"
        sx={{
          width: drawerOpen ? 260 : 0,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: "border-box",
          },
        }}
        onClose={() => setDrawerOpen(false)}
      >
        <Toolbar variant="dense" sx={{ paddingLeft: "0.2rem !important" }}>
          <IconButton
            aria-label="Open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuRounded />
          </IconButton>
          <Typography
            component="h1"
            noWrap
            variant="h6"
            sx={{
              flexGrow: 0,
              marginLeft: "0.5rem",
              userSelect: "none",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            Home Panel
          </Typography>
        </Toolbar>
        <Divider />
        <Stack
          direction="column"
          sx={{ flexGrow: 1, overflow: "auto", width: "100%" }}
        >
          <List>
            {dashboards.map((dashboard: DashboardModel) => (
              <Stack
                key={dashboard.id}
                direction="row"
                flexWrap="nowrap"
                sx={{ width: "100%" }}
              >
                <Link
                  href={`/dashboards/${dashboard.id}`}
                  style={{ flexGrow: 1 }}
                >
                  <ListItemButton
                    selected={
                      dashboardPath === `/dashboards/${dashboard.id}` ||
                      dashboardPath === `/dashboards/${dashboard.id}/edit`
                    }
                    onClick={() => setDrawerOpen(false)}
                    sx={{ height: "100%", flexGrow: 1 }}
                  >
                    <ListItemIcon>
                      <DashboardRounded fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText
                      primary={dashboard.name}
                      secondary={dashboard.description}
                    />
                  </ListItemButton>
                </Link>
                <Link href={`/dashboards/${dashboard.id}/edit`}>
                  <ListItemButton
                    aria-label={`Configure ${dashboard.name}`}
                    selected={
                      dashboardPath === `/dashboards/${dashboard.id}` ||
                      dashboardPath === `/dashboards/${dashboard.id}/edit`
                    }
                    onClick={() => setDrawerOpen(false)}
                    sx={{ height: "100%" }}
                  >
                    <SettingsRounded />
                  </ListItemButton>
                </Link>
              </Stack>
            ))}
            <Link href="/dashboards/new">
              <ListItemButton>
                <ListItemIcon>
                  <AddRounded fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary="Create Dashboard"
                  secondary="Create a new dashboard"
                />
              </ListItemButton>
            </Link>
          </List>
        </Stack>
        <Divider />
        <Stack direction="column">
          {status === "loading" ? (
            <Skeleton variant="rectangular" width="100%" height={40} />
          ) : (
            <ListItemButton
              onClick={() =>
                status === "authenticated" ? signOut() : signIn()
              }
            >
              <ListItemIcon sx={{ marginLeft: "-0.1rem" }}>
                <Avatar
                  alt={session?.user?.name ?? "Unknown"}
                  src={session?.user?.image ?? undefined}
                  variant="circular"
                  sx={{ width: 28, height: 28 }}
                />
              </ListItemIcon>
              <ListItemText
                primary={`Sign ${status === "authenticated" ? "Out" : "In"}`}
                secondary={
                  status !== "authenticated"
                    ? "Sign in using credentials"
                    : session?.user?.name ?? "Unknown"
                }
              />
            </ListItemButton>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
