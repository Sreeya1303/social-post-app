import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider
} from '@mui/material';
import {
    Person as PersonIcon,
    Search as SearchIcon,
    Chat as ChatIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UserSearch from '../components/UserSearch';
import { useAuth } from '../context/AuthContext';

/**
 * Dashboard Page Component
 * Social discovery hub with user search and genre exploration
 */
const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedGenre] = useState(null);

    // Refs for scrolling/focus interaction
    const searchInputRef = React.useRef(null);
    const topicsRef = React.useRef(null);

    // Popular genres/categories
    const genres = [
        { id: 1, name: 'Technology', color: '#4facfe', icon: '💻' },
        { id: 2, name: 'Sports', color: '#fa709a', icon: '⚽' },
        { id: 3, name: 'Music', color: '#51cf66', icon: '🎵' },
        { id: 4, name: 'Art', color: '#ffd43b', icon: '🎨' },
        { id: 5, name: 'Food', color: '#ff6b6b', icon: '🍕' },
        { id: 6, name: 'Travel', color: '#845ef7', icon: '✈️' },
        { id: 7, name: 'Gaming', color: '#20c997', icon: '🎮' },
        { id: 8, name: 'Fashion', color: '#ff8c42', icon: '👔' },
        { id: 9, name: 'Business', color: '#1971c2', icon: '💼' },
        { id: 10, name: 'Health', color: '#2f9e44', icon: '💪' }
    ];

    const handleQuickAction = (title) => {
        switch (title) {
            case 'Find Users':
                searchInputRef.current?.focus();
                searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                break;
            case 'Messages':
                navigate('/chat');
                break;
            case 'Explore Topics':
                topicsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                break;
            default:
                break;
        }
    };

    const quickActions = [
        { title: 'Find Users', icon: PersonIcon, description: 'Search and connect with people', color: '#4facfe' },
        { title: 'Start Chat', icon: ChatIcon, description: 'Message your connections', color: '#fa709a' },
        { title: 'Explore Topics', icon: CategoryIcon, description: 'Browse by interests', color: '#51cf66' }
    ];

    return (
        <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh' }}>
            <Navbar />
            <Sidebar />

            {/* Main content with left margin for sidebar */}
            <Box sx={{ ml: '240px', pt: 3 }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {/* Welcome Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}
                        >
                            Discover & Connect
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Welcome back, <strong>{user?.username}</strong>! Find users and explore topics.
                        </Typography>
                    </Box>

                    {/* User Search Section */}
                    <Paper elevation={0} sx={{ borderRadius: 3, p: 4, mb: 4, bgcolor: '#fff' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <SearchIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Find People
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Search for users to view their profiles or start a conversation
                                </Typography>
                            </Box>
                        </Box>
                        <UserSearch inputRef={searchInputRef} />
                    </Paper>

                    {/* Quick Actions Grid */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={3}>
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Card
                                            elevation={0}
                                            onClick={() => handleQuickAction(action.title)}
                                            sx={{
                                                borderRadius: 3,
                                                bgcolor: '#fff',
                                                border: '2px solid #f0f0f0',
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                                    borderColor: action.color
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                                <Icon sx={{ fontSize: 48, color: action.color, mb: 2 }} />
                                                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                                                    {action.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {action.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>

                    {/* Genres/Topics Section */}
                    <Paper ref={topicsRef} elevation={0} sx={{ borderRadius: 3, p: 4, bgcolor: '#fff' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <CategoryIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Explore Topics
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Discover content by your interests
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {genres.map((genre) => (
                                <Chip
                                    key={genre.id}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span>{genre.icon}</span>
                                            <span>{genre.name}</span>
                                        </Box>
                                    }
                                    onClick={() => navigate(`/feed?genre=${genre.name}`)}
                                    sx={{
                                        px: 2,
                                        py: 2.5,
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        cursor: 'pointer',
                                        bgcolor: selectedGenre === genre.id ? genre.color : '#f5f5f5',
                                        color: selectedGenre === genre.id ? '#fff' : 'text.primary',
                                        border: '2px solid transparent',
                                        '&:hover': {
                                            bgcolor: selectedGenre === genre.id ? genre.color : '#e0e0e0',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        },
                                        transition: 'all 0.3s'
                                    }}
                                />
                            ))}
                        </Box>

                        {selectedGenre && (
                            <Box sx={{ mt: 3, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Genre filtering coming soon! Posts with{' '}
                                    <strong>{genres.find(g => g.id === selectedGenre)?.name}</strong> will appear here.
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    {/* Chat Preview Section (Placeholder) */}
                    <Paper elevation={0} sx={{ borderRadius: 3, p: 4, mt: 4, bgcolor: '#fff' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <ChatIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Recent Conversations
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Your chat messages will appear here
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <ChatIcon sx={{ fontSize: 64, color: '#bbb', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No conversations yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Start chatting with other users to see your messages here
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;
