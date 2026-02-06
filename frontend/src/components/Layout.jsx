import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
            <CssBaseline />

            {/* Navbar - Fixed at top */}
            <Navbar onDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />

            {/* Sidebar - Responsive Drawer */}
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={handleDrawerToggle}
                drawerWidth={drawerWidth}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8 // Space for fixed navbar
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
