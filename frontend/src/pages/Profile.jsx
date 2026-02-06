import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, CircularProgress, Alert, Grid, Paper,
    Button, Avatar, Divider
} from '@mui/material';
import {
    Article as ArticleIcon, Favorite as FavoriteIcon,
    Visibility as VisibilityIcon, People as PeopleIcon,
    Chat as ChatIcon
} from '@mui/icons-material';
import PostCard from '../components/PostCard';
import { usersAPI, postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const profileUserId = userId || currentUser?.id;
    const isOwnProfile = profileUserId === currentUser?.id;

    const fetchProfile = async () => {
        try {
            setError('');
            setLoading(true);
            const profileResponse = await usersAPI.getUserProfile(profileUserId);
            setProfile(profileResponse.data.user);

            if (isOwnProfile) {
                const postsResponse = await postsAPI.getMyPosts();
                setPosts(postsResponse.data.posts || []);
            } else {
                const allPostsResponse = await postsAPI.getAllPosts();
                const userPosts = (allPostsResponse.data.posts || []).filter(post => post.userId === profileUserId);
                setPosts(userPosts);
            }

            if (!isOwnProfile) {
                const followersResponse = await usersAPI.getFollowers(profileUserId);
                const followers = followersResponse.data.followers || [];
                const isCurrentlyFollowing = followers.some(follower => follower.userId === currentUser?.id);
                setIsFollowing(isCurrentlyFollowing);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to load profile';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profileUserId) fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileUserId]);

    const handleFollowClick = async () => {
        try {
            setFollowLoading(true);
            const response = await usersAPI.followUser(profileUserId);
            setIsFollowing(response.data.isFollowing);
            setProfile(prev => ({ ...prev, followerCount: response.data.followerCount }));
        } catch (err) {
            console.error('Follow error:', err);
        } finally {
            setFollowLoading(false);
        }
    };

    const handlePostUpdate = () => fetchProfile();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !profile) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Profile not found'}</Alert>
            </Container>
        );
    }

    return (
        <Box>
            <Container maxWidth="lg">
                <Paper elevation={0} sx={{ borderRadius: 3, p: 4, mb: 3, bgcolor: '#fff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ width: 100, height: 100, bgcolor: '#4facfe', fontSize: '2.5rem', fontWeight: 700 }}>
                                {profile.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={700}>{profile.username}</Typography>
                                <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                        {!isOwnProfile && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ChatIcon />}
                                    onClick={() => navigate(`/chat?userId=${profileUserId}`)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.5
                                    }}
                                >
                                    Message
                                </Button>
                                <Button
                                    variant={isFollowing ? 'outlined' : 'contained'}
                                    onClick={handleFollowClick}
                                    disabled={followLoading}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        boxShadow: isFollowing ? 'none' : '0 4px 12px rgba(33, 150, 243, 0.3)'
                                    }}
                                >
                                    {followLoading ? <CircularProgress size={20} /> : (isFollowing ? 'Unfollow' : 'Follow')}
                                </Button>
                            </Box>
                        )}
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Grid container spacing={3}>
                        <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    <ArticleIcon sx={{ color: '#4facfe', fontSize: 28, mr: 1 }} />
                                    <Typography variant="h5" fontWeight={700} color="#4facfe">{profile.postCount || 0}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Posts</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    <PeopleIcon sx={{ color: '#fa709a', fontSize: 28, mr: 1 }} />
                                    <Typography variant="h5" fontWeight={700} color="#fa709a">{profile.followerCount || 0}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Followers</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    <FavoriteIcon sx={{ color: '#51cf66', fontSize: 28, mr: 1 }} />
                                    <Typography variant="h5" fontWeight={700} color="#51cf66">{profile.totalLikes || 0}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Likes</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    <VisibilityIcon sx={{ color: '#ffd43b', fontSize: 28, mr: 1 }} />
                                    <Typography variant="h5" fontWeight={700} color="#ffd43b">{profile.totalViews || 0}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Views</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper elevation={0} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                        {isOwnProfile ? 'My Posts' : `${profile.username}'s Posts`}
                    </Typography>
                    {posts.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <ArticleIcon sx={{ fontSize: 64, color: '#bbb', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                {isOwnProfile ? "You haven't created any posts yet" : 'No posts yet'}
                            </Typography>
                        </Box>
                    )}
                    {posts.length > 0 && (
                        <Box>
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdate} showStats={true} />
                            ))}
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Profile;
