import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import FeedIcon from '@mui/icons-material/Feed';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';

/**
 * Sidebar Navigation Component
 * Provides navigation links for Feed, Dashboard, and Profile
 */
const Sidebar = ({ mobileOpen, onClose, drawerWidth }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Feed', icon: FeedIcon, path: '/feed' },
        { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
        { text: 'Messages', icon: ChatIcon, path: '/chat' },
        { text: 'Profile', icon: PersonIcon, path: '/profile' }
    ];

    const isActive = (path) => {
        if (path === '/feed' && (location.pathname === '/feed' || location.pathname === '/')) {
            return true;
        }
        if (path === '/profile' && location.pathname.startsWith('/profile')) {
            return true;
        }
        return location.pathname === path;
    };

    const handleItemClick = (path) => {
        navigate(path);
        if (mobileOpen) {
            onClose(); // Close drawer on mobile when item clicked
        }
    };

    const drawerContent = (
        <Box sx={{ mt: 8 }}>
            <List>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => handleItemClick(item.path)}
                                sx={{
                                    mx: 1,
                                    mb: 0.5,
                                    borderRadius: 2,
                                    bgcolor: active ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: active ? 'rgba(33, 150, 243, 0.15)' : 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <Icon sx={{ color: active ? '#2196f3' : '#666' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: active ? 600 : 400,
                                        color: active ? '#2196f3' : '#333'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid #e0e0e0',
                        top: 'auto' // Important for clipping under AppBar
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
