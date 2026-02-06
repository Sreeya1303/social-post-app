import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import FeedIcon from '@mui/icons-material/Feed';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';

/**
 * Sidebar Navigation Component
 * Provides navigation links for Feed, Dashboard, and Profile
 */
const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Feed', icon: FeedIcon, path: '/feed' },
        { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
        { text: 'Messages', icon: ChatIcon, path: '/chat' },
        { text: 'Profile', icon: PersonIcon, path: '/profile' }
    ];

    const isActive = (path) => location.pathname === path || (path === '/profile' && location.pathname.startsWith('/profile'));

    return (
        <Box
            sx={{
                width: 240,
                height: '100vh',
                position: 'fixed',
                top: 64, // Below navbar
                left: 0,
                bgcolor: '#fff',
                borderRight: '1px solid #e0e0e0',
                boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                zIndex: 1000
            }}
        >
            <List sx={{ pt: 2 }}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
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
};

export default Sidebar;
