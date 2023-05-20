"use client";
import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ArrowBackRounded,
  DashboardRounded,
  MenuRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export function DrawerComponent(): JSX.Element {
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
          left: drawerOpen ? 240 : 0,
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
          width: drawerOpen ? 240 : 0,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
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
            <Link href="/">
              <ListItemButton
                selected={
                  pathname !== `${dashboardPath}/edit` &&
                  pathname.startsWith("/dashboards")
                }
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>
                  <DashboardRounded fontSize="medium" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </Link>
          </List>
        </Stack>
        <Divider />
        {status === "authenticated" && dashboardPath && (
          <>
            <Stack direction="column">
              <Link href={`${dashboardPath}/edit`}>
                <ListItemButton selected={pathname === `${dashboardPath}/edit`}>
                  <ListItemIcon>
                    <SettingsRounded fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary="Configure Dashboard" />
                </ListItemButton>
              </Link>
            </Stack>
            <Divider />
          </>
        )}
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
              />
            </ListItemButton>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
