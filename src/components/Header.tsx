"use client";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { DashboardRounded, PersonRounded } from "@mui/icons-material";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import type { RecordProfile } from "@/types/database.types";

const links = [
  {
    label: "Dashboard",
    href: "/",
    icon: <DashboardRounded fontSize="small" sx={{ marginRight: "0.2rem" }} />,
  },
];

interface User extends Partial<RecordProfile> {
  email?: string;
  loggedIn: boolean;
}

export function Header() {
  const [user, setUser] = useState<User>();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const pathname = usePathname();

  function handleOpenUserMenu(event: React.MouseEvent<HTMLElement>): void {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseUserMenu(): void {
    setAnchorElUser(null);
  }

  function handleLogout(): void {
    handleCloseUserMenu();
  }

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
        <Stack direction="row" justifyContent="center" sx={{ flexGrow: 1 }}>
          {user && user.loggedIn
            ? links.map(({ label, href, icon }) => (
                <Link key={label} href={href} passHref>
                  <Button
                    color={href === pathname ? "primary" : "inherit"}
                    sx={{ marginRight: "0.4rem" }}
                  >
                    {icon}
                    {label}
                  </Button>
                </Link>
              ))
            : null}
        </Stack>
        <Stack direction="row" sx={{ flexGrow: 0 }}>
          {user && user.loggedIn && user.first_name && user.last_name ? (
            <Tooltip title={`${user.first_name} ${user.last_name}`}>
              <IconButton onClick={handleOpenUserMenu} sx={{ padding: 0 }}>
                <Avatar
                  alt={`${user.first_name} ${user.last_name}`}
                  src={user.picture}
                  sx={{ width: 38, height: 38 }}
                >
                  {user.first_name[0]}
                  {user.last_name[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          ) : (
            <Avatar alt="User" sx={{ width: 38, height: 38 }}>
              <PersonRounded color="inherit" fontSize="large" />
            </Avatar>
          )}
        </Stack>
      </Toolbar>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={user && anchorElUser ? true : false}
        onClose={handleCloseUserMenu}
      >
        <Link href="/profile" passHref>
          <MenuItem
            disabled={user && user.loggedIn ? false : true}
            onClick={handleCloseUserMenu}
          >
            <Typography textAlign="center">Profile</Typography>
          </MenuItem>
        </Link>
        <MenuItem
          disabled={user && user.loggedIn ? false : true}
          onClick={handleLogout}
        >
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
