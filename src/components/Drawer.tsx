"use client";
import {
  Avatar,
  Divider,
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

export function DrawerComponent(): JSX.Element {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  console.log(session, status, pathname);

  return (
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
      <Divider />
      <Stack
        direction="column"
        sx={{ flexGrow: 1, overflow: "auto", width: "100%" }}
      >
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
      <Divider />
      <Stack direction="column">
        {status === "loading" ? (
          <Skeleton variant="rectangular" width="100%" height={40} />
        ) : (
          <ListItemButton
            onClick={() => (status === "authenticated" ? signOut() : signIn())}
          >
            <ListItemIcon sx={{ marginLeft: "-0.2rem" }}>
              <Avatar
                alt={session?.user?.name ?? "Unknown"}
                src={session?.user?.image ?? undefined}
                variant="circular"
              />
            </ListItemIcon>
            <ListItemText
              primary={`Sign ${status === "authenticated" ? "Out" : "In"}`}
            />
          </ListItemButton>
        )}
      </Stack>
    </Drawer>
  );
}
