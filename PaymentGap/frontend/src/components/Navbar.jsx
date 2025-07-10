import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Define navigation items
  const navItems = isAuthenticated
    ? [
        { label: 'Home Page', to: '/homepage' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Import Excel', to: '/import' },
        { label: 'Employees', to: '/employees' },
        { label: 'Logout', action: onLogout, color: 'error' },
      ]
    : [
        { label: 'Login', to: '/login' },
        { label: 'Register', to: '/register', color: 'secondary' },
      ];

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const renderButtons = () => (
    navItems.map((item, idx) =>
      item.to ? (
        <Button
          key={idx}
          component={Link}
          to={item.to}
          color={item.color || 'primary'}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          {item.label}
        </Button>
      ) : (
        <Button
          key={idx}
          onClick={() => {
            item.action && item.action();
          }}
          color={item.color || 'primary'}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          {item.label}
        </Button>
      )
    )
  );

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            Payment Gap Analyzer
          </Typography>

          {isMobile ? (
            <IconButton edge="end" onClick={handleDrawerToggle} color="inherit">
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              {renderButtons()}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
          <List>
            {navItems.map((item, idx) => (
              <ListItem key={idx} disablePadding>
                {item.to ? (
                  <ListItemButton component={Link} to={item.to}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ) : (
                  <ListItemButton onClick={item.action}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
