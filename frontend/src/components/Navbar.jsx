import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Avatar, Box, Button, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ShareIcon from '@mui/icons-material/Share';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation bar component
 * Displays app logo, user info, and logout button
 */
const Navbar = ({ onDrawerToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    return (
        <AppBar
            position="fixed"
            elevation={2}
            sx={{
                background: 'linear-gradient(90deg, #2196f3 0%, #1976d2 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left Side: Menu Button + Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Menu Button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onDrawerToggle}
                        sx={{
                            mr: 2,
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '10px',
                            p: 0.8,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                borderColor: '#fff'
                            }
                        }}
                    >
                        <MenuIcon sx={{ fontSize: 24 }} />
                    </IconButton>

                    {/* App Logo/Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShareIcon sx={{ fontSize: 32 }} />
                        <Typography
                            variant="h6"
                            component="div"
                            fontWeight={700}
                            sx={{ letterSpacing: 0.5 }}
                        >
                            SocialPost
                        </Typography>
                    </Box>
                </Box>

                {/* User Info and Logout */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                            {user.username}
                        </Typography>
                    </Box>

                    <Avatar
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '2px solid white',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/profile')}
                    >
                        {user.username?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Button
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                                borderColor: 'white',
                                bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                        variant="outlined"
                        size="small"
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
