import { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Divider,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
} from "@mui/material";
import {
  Close,
  Menu as MenuIcon,
  Logout,
  Person,
  Settings,
  AdminPanelSettings,
  Dashboard,
  ExpandMore,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────

const ADMIN_ROLES = ["super_admin", "admin", "org_admin"];

const NAV_LINKS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <Dashboard fontSize="small" />,
    authRequired: true,
  },
];

const USER_MENU_ITEMS = [
  { label: "Profile", to: "/profile", icon: <Person fontSize="small" /> },
  {
    label: "Security",
    to: "/settings/security",
    icon: <Settings fontSize="small" />,
  },
  {
    label: "Sessions",
    to: "/settings/sessions",
    icon: <Settings fontSize="small" />,
  },
];

const ADMIN_MENU_ITEM = {
  label: "Admin Panel",
  to: "/admin/users",
  icon: <AdminPanelSettings fontSize="small" />,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Dropdown user-avatar menu (desktop).
 * Renders with a Portal so it escapes the AppBar stacking context cleanly.
 */
const UserMenu = ({ user, onNavigate, onLogout }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const menuRef = useRef(null);
  const isAdmin = ADMIN_ROLES.includes(user?.role);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        !anchorRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleItem = (to) => {
    setOpen(false);
    onNavigate(to);
  };

  const menuItems = [...USER_MENU_ITEMS, ...(isAdmin ? [ADMIN_MENU_ITEM] : [])];

  return (
    <Box sx={{ position: "relative" }}>
      {/* Trigger */}
      <Box
        ref={anchorRef}
        onClick={() => setOpen((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          cursor: "pointer",
          px: 1,
          py: 0.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: open ? "primary.main" : "divider",
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: "0 0 0 3px rgba(25,118,210,0.08)",
          },
        }}
      >
        <Avatar
          src={user?.avatar_url}
          sx={{
            width: 32,
            height: 32,
            fontSize: "0.85rem",
            bgcolor: "primary.main",
          }}
        >
          {user?.full_name?.[0]?.toUpperCase() ?? "U"}
        </Avatar>

        <Box sx={{ display: { xs: "none", lg: "block" }, lineHeight: 1.2 }}>
          {/* <Typography
            variant="caption"
            fontWeight={600}
            display="block"
            noWrap
            sx={{ maxWidth: 120 }}
          >
            {user?.full_name ?? "Account"}
          </Typography> */}
          {isAdmin && (
            <Chip
              label={user.role.replace("_", " ")}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 16, fontSize: "0.6rem", mt: 0.25 }}
            />
          )}
        </Box>

        <KeyboardArrowDown
          fontSize="small"
          sx={{
            color: "text.secondary",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </Box>

      {/* Floating menu */}
      {open && (
        <Box
          ref={menuRef}
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 220,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            zIndex: 1400,
            overflow: "hidden",
            animation: "menuFadeIn 0.15s ease",
            "@keyframes menuFadeIn": {
              from: { opacity: 0, transform: "translateY(-6px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Header */}
          <Box sx={{ px: 2, py: 1.5, bgcolor: "grey.50" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.full_name ?? "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>

          <Divider />

          {/* Nav items */}
          {menuItems.map(({ label, to, icon }) => (
            <MenuItem
              key={to}
              icon={icon}
              label={label}
              onClick={() => handleItem(to)}
            />
          ))}

          <Divider />

          <MenuItem
            icon={<Logout fontSize="small" />}
            label="Log out"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            sx={{
              color: "error.main",
              "& .MuiListItemIcon-root": { color: "error.main" },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

/** Tiny shared menu-item row */
const MenuItem = ({ icon, label, onClick, sx }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      all: "unset",
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: 2,
      py: 1.25,
      width: "100%",
      cursor: "pointer",
      typography: "body2",
      color: "text.primary",
      transition: "background 0.15s",
      "&:hover": { bgcolor: "action.hover" },
      ...sx,
    }}
  >
    <Box
      sx={{
        color: "text.secondary",
        display: "initial",
        ...sx?.["& .MuiListItemIcon-root"],
      }}
    >
      {icon}
    </Box>
    {label}
  </Box>
);

/** Mobile drawer */
const MobileDrawer = ({
  open,
  onClose,
  isAuthenticated,
  user,
  onNavigate,
  onLogout,
}) => {
  const location = useLocation();
  const isAdmin = ADMIN_ROLES.includes(user?.role);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const go = (to) => {
    onNavigate(to);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 320 },
          p: 0,
          bgcolor: "background.paper",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="primary.main">
          Expense App
        </Typography>
        <IconButton onClick={onClose} size="small" edge="end">
          <Close />
        </IconButton>
      </Box>

      {isAuthenticated ? (
        <>
          {/* User card */}
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={user?.avatar_url}
                sx={{ width: 44, height: 44, bgcolor: "primary.main" }}
              >
                {user?.full_name?.[0]?.toUpperCase() ?? "U"}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.full_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Nav */}
          <List disablePadding sx={{ flex: 1 }}>
            <DrawerItem
              icon={<Dashboard fontSize="small" />}
              label="Dashboard"
              selected={location.pathname === "/dashboard"}
              onClick={() => go("/dashboard")}
            />

            {isAdmin && (
              <DrawerItem
                icon={<AdminPanelSettings fontSize="small" />}
                label="Admin Panel"
                selected={location.pathname.startsWith("/admin")}
                onClick={() => go("/admin/users")}
              />
            )}

            {/* Settings group */}
            <ListItemButton
              onClick={() => setSettingsOpen((v) => !v)}
              sx={{ px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ variant: "body2" }}
              />
              <ExpandMore
                fontSize="small"
                sx={{
                  color: "text.secondary",
                  transition: "transform 0.2s",
                  transform: settingsOpen ? "rotate(180deg)" : "none",
                }}
              />
            </ListItemButton>

            <Collapse in={settingsOpen}>
              <DrawerItem
                label="Profile"
                onClick={() => go("/profile")}
                indent
              />
              <DrawerItem
                label="Security"
                onClick={() => go("/settings/security")}
                indent
              />
              <DrawerItem
                label="Sessions"
                onClick={() => go("/settings/sessions")}
                indent
              />
            </Collapse>
          </List>

          <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <DrawerItem
              icon={<Logout fontSize="small" />}
              label="Log out"
              onClick={() => {
                onLogout();
                onClose();
              }}
              sx={{
                color: "error.main",
                "& .MuiListItemIcon-root": { color: "error.main" },
              }}
            />
          </Box>
        </>
      ) : (
        <Box
          sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/login"
            onClick={onClose}
          >
            Log in
          </Button>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            to="/register"
            onClick={onClose}
          >
            Get Started
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

const DrawerItem = ({ icon, label, selected, onClick, indent, sx }) => (
  <ListItemButton
    selected={selected}
    onClick={onClick}
    sx={{ px: indent ? 5 : 2.5, py: 1.25, ...sx }}
  >
    {icon && (
      <ListItemIcon
        sx={{
          minWidth: 36,
          color: selected ? "primary.main" : "text.secondary",
          ...sx?.["& .MuiListItemIcon-root"],
        }}
      >
        {icon}
      </ListItemIcon>
    )}
    <ListItemText
      primary={label}
      primaryTypographyProps={{
        variant: "body2",
        fontWeight: selected ? 600 : 400,
        color: sx?.color ?? (selected ? "primary.main" : "text.primary"),
      }}
    />
  </ListItemButton>
);

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const isAdmin = ADMIN_ROLES.includes(user?.role);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar
          sx={{         
            width: "100%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            minHeight: { xs: 56, sm: 64 },
            gap: 2,
          }}
        >
          {/* ── Logo ── */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              textDecoration: "none",
              letterSpacing: "-0.5px",
              flexShrink: 0,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            Expense App
          </Typography>

          {/* ── Spacer ── */}
          <Box sx={{ flexGrow: 1 }} />

          {/* ── Desktop nav links ── */}
          <Box
            component="nav"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" label="Dashboard" />
                {isAdmin && <NavLink to="/admin/users" label="Admin" />}
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  size="small"
                  sx={{ fontWeight: 500 }}
                >
                  Log in
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="small"
                  disableElevation
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>

          {/* ── User menu (desktop) ── */}
          {isAuthenticated && (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <UserMenu user={user} onNavigate={navigate} onLogout={logout} />
            </Box>
          )}

          {/* ── Mobile hamburger ── */}
          <IconButton
            sx={{ display: { md: "none" } }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            size="small"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ── Mobile drawer ── */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onNavigate={navigate}
        onLogout={logout}
      />
    </>
  );
};

// ─── Active nav link

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const active =
    location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Button
      component={Link}
      to={to}
      size="small"
      sx={{
        fontWeight: active ? 600 : 500,
        color: active ? "primary.main" : "text.secondary",
        position: "relative",
        borderRadius: 1.5,
        px: 1.5,
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 4,
          left: "50%",
          transform: active
            ? "translateX(-50%) scaleX(1)"
            : "translateX(-50%) scaleX(0)",
          width: "60%",
          height: 2,
          bgcolor: "primary.main",
          borderRadius: 1,
          transition: "transform 0.2s ease",
        },
        "&:hover": { color: "primary.main", bgcolor: "primary.50" },
        "&:hover::after": { transform: "translateX(-50%) scaleX(1)" },
        transition: "color 0.2s",
      }}
    >
      {label}
    </Button>
  );
};
