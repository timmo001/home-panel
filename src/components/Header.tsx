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
import { DashboardRounded, PersonRounded } from "@mui/icons-material";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// const links = [
//   {
//     label: "Dashboard",
//     href: "/",
//     icon: <DashboardRounded fontSize="small" sx={{ marginRight: "0.2rem" }} />,
//   },
// ];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  console.log(session, status, pathname);

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar variant="dense">
        <Typography
          component="div"
          noWrap
          variant="h6"
          sx={{ flexGrow: 0, userSelect: "none" }}
        >
          Home Panel
        </Typography>
      </Toolbar>
      {/* <Drawer
        anchor="left"
        open
        onClose={() => {}}
        sx={{ marginTop: 68 }}
      > */}
      <Stack
        direction="column"
        spacing={1}
        sx={{ padding: "1rem", width: "100%" }}
      >
        <Stack direction="column" spacing={1}>
          <List>
            <Link href="/" passHref>
              <ListItemButton component="a" selected={pathname === "/"}>
                <ListItemIcon>
                  <DashboardRounded fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </Link>
          </List>
        </Stack>
        <Stack direction="column" spacing={1}>
          <List>
            <Link href="/users" passHref>
              <ListItemButton component="a" selected={pathname === "/users"}>
                <ListItemIcon>
                  <PersonRounded fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </Link>
            {status === "loading" ? (
              <Skeleton variant="rectangular" width="100%" height={40} />
            ) : (
              <ListItemButton
                component="a"
                onClick={() =>
                  status === "authenticated" ? signOut() : signIn()
                }
              >
                <ListItemIcon>
                  <Avatar
                    alt={session?.user?.name ?? "Unknown"}
                    src={session?.user?.image ?? undefined}
                    sizes="24px"
                    variant="circular"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={`Sign ${status === "authenticated" ? "Out" : "In"}`}
                />
              </ListItemButton>
            )}
          </List>
        </Stack>
      </Stack>
      {/* </Drawer> */}
    </AppBar>
  );
}
