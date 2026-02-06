import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { postsAPI } from '../services/api';

/**
 * Feed Page Component
 * Main page displaying all posts and create post form
 */
const Feed = () => {
    const [searchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreatePost, setShowCreatePost] = useState(true);

    // Get genre from URL query param if present
    useEffect(() => {
        // Legacy: genre param ignored
    }, [searchParams]);

    const fetchPosts = async () => {
        try {
            setError('');
            setLoading(true);

            console.log('Fetching posts');
            const response = await postsAPI.getAllPosts();
            console.log('Received posts:', response.data.posts.length);
            setPosts(response.data.posts || []);
        } catch (err) {
            setError('Failed to load posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Refresh posts when a new post is created or updated
     */
    const handlePostUpdate = () => {
        fetchPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh' }}>
            <Navbar />
            <Sidebar />

            {/* Main content with left margin for sidebar */}
            <Box sx={{ ml: '240px', pt: 3 }}>
                <Container maxWidth="md" sx={{ py: 4 }}>
                    {/* Page Title */}
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
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
                            Social Feed
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Share your thoughts and connect with others
                        </Typography>
                    </Box>



                    {/* Create Post Section */}
                    {showCreatePost && (
                        <CreatePost onPostCreated={handlePostUpdate} />
                    )}

                    {/* Posts List */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    ) : posts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                No posts found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Be the first to share something!
                            </Typography>
                        </Box>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
                        ))
                    )}
                </Container>
            </Box>

            {/* Floating Action Button for Mobile */}
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 20, right: 20, display: { md: 'none' } }}
                onClick={() => setShowCreatePost(!showCreatePost)}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};
export default Feed;
