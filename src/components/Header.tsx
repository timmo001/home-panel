"use client";
import {
  AppBar,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { DashboardRounded } from "@mui/icons-material";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  console.log(session, status, pathname);

  return (
    <AppBar color="transparent" elevation={0} position="fixed">
      <Toolbar variant="dense">
        <Typography
          component="div"
          noWrap
          variant="h6"
          sx={{
            flexGrow: 0,
            userSelect: "none",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          Home Panel
        </Typography>
      </Toolbar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar variant="dense" />
        <Stack
          direction="column"
          sx={{ padding: "1rem", overflow: "auto", width: "100%" }}
        >
          <Stack direction="column">
            <List>
              <Link href="/">
                <ListItemButton selected={pathname === "/"}>
                  <ListItemIcon>
                    <DashboardRounded />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </Link>
            </List>
          </Stack>
          <Stack direction="column">
            {status === "loading" ? (
              <Skeleton variant="rectangular" width="100%" height={40} />
            ) : (
              <ListItemButton
                onClick={() =>
                  status === "authenticated" ? signOut() : signIn()
                }
              >
                <ListItemIcon>
                  <Avatar
                    alt={session?.user?.name ?? "Unknown"}
                    src={session?.user?.image ?? undefined}
                    variant="circular"
                    sx={{ height: 28, width: 28 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={`Sign ${status === "authenticated" ? "Out" : "In"}`}
                />
              </ListItemButton>
            )}
          </Stack>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
