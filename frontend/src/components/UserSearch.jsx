import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    IconButton,
    InputAdornment,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    Search as SearchIcon,
    ChatBubble as ChatIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { usersAPI } from '../services/api';

/**
 * UserSearch Component
 * Search for users and navigate to their profiles or start chat
 */
const UserSearch = ({ inputRef }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    /**
     * Debounced search effect
     */
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                performSearch();
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    /**
     * Perform user search
     */
    const performSearch = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.searchUsers(searchQuery);
            setSearchResults(response.data.users || []);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Navigate to user profile
     */
    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
        setShowResults(false);
        setSearchQuery('');
    };

    /**
     * Start chat with user (placeholder for now)
     */
    const handleChatClick = (userId) => {
        navigate(`/chat?userId=${userId}`);
        setShowResults(false);
        setSearchQuery('');
    };

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            {/* Search Input */}
            <TextField
                inputRef={inputRef}
                fullWidth
                placeholder="Search for users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                    endAdornment: loading && (
                        <InputAdornment position="end">
                            <CircularProgress size={20} />
                        </InputAdornment>
                    )
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 5,
                        bgcolor: 'white',
                        '&:hover': {
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                    }
                }}
            />

            {/* Search Results Dropdown */}
            {showResults && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'absolute',
                        top: '60px',
                        left: 0,
                        right: 0,
                        maxHeight: 400,
                        overflowY: 'auto',
                        zIndex: 1000,
                        borderRadius: 3
                    }}
                >
                    {searchResults.length === 0 && !loading && (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No users found
                            </Typography>
                        </Box>
                    )}

                    {searchResults.length > 0 && (
                        <List sx={{ p: 1 }}>
                            {searchResults.map((user) => (
                                <ListItem
                                    key={user._id}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: '#f5f5f5'
                                        }
                                    }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChatClick(user._id);
                                            }}
                                            sx={{
                                                color: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: 'rgba(25, 118, 210, 0.1)'
                                                }
                                            }}
                                        >
                                            <ChatIcon />
                                        </IconButton>
                                    }
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {user.username}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            )}

            {/* Click away handler */}
            {showResults && (
                <Box
                    onClick={() => setShowResults(false)}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                />
            )}
        </Box>
    );
};

export default UserSearch;
