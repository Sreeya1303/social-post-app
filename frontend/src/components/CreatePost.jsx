import React, { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    Avatar,
    Alert,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CampaignIcon from '@mui/icons-material/Campaign';
import CategoryIcon from '@mui/icons-material/Category';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import EmojiPicker from './EmojiPicker';

/**
 * CreatePost Component
 * Allows users to create new posts with text, images, and genre
 * Enhanced with tabs and icon buttons
 */
const CreatePost = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [genre, setGenre] = useState('Other');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [isPromotion, setIsPromotion] = useState(false);
    const [emojiAnchor, setEmojiAnchor] = useState(null);

    const genres = [
        'Technology', 'Sports', 'Music', 'Art', 'Food',
        'Travel', 'Gaming', 'Fashion', 'Business', 'Health', 'Other'
    ];

    /**
     * Handle tab change
     */
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    /**
     * Handle image selection
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
        }
    };

    /**
     * Remove selected image
     */
    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    /**
     * Submit post
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate that at least one field is filled
        if (!content.trim() && !image) {
            setError('Post must contain either text or an image');
            return;
        }

        setLoading(true);

        try {
            // Create FormData for multipart upload
            const formData = new FormData();
            if (content.trim()) {
                formData.append('content', content.trim());
            }
            if (image) {
                formData.append('image', image);
            }
            formData.append('genre', genre);
            formData.append('isPromotion', String(isPromotion));

            await postsAPI.createPost(formData);

            // Reset form
            setContent('');
            setImage(null);
            setImagePreview(null);
            setGenre('Other');
            setIsPromotion(false);

            // Notify parent to refresh posts
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            elevation={3}
            sx={{
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)'
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header with Tabs */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Create Post
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant={tabValue === 0 ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setTabValue(0)}
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                        >
                            All Posts
                        </Button>
                        <Button
                            variant={tabValue === 1 ? 'contained' : 'outlined'}
                            size="small"
                            disabled
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                        >
                            Promotions
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* User Avatar */}
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            mt: 1,
                            width: 48,
                            height: 48,
                            fontSize: '1.2rem'
                        }}
                    >
                        {user.username?.charAt(0).toUpperCase()}
                    </Avatar>

                    {/* Post Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            variant="outlined"
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <Box sx={{ position: 'relative', mb: 2 }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '12px'
                                    }}
                                />
                                <IconButton
                                    onClick={handleRemoveImage}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Genre Selection and Promotion */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel id="genre-select-label">Genre</InputLabel>
                                <Select
                                    labelId="genre-select-label"
                                    value={genre}
                                    label="Genre"
                                    onChange={(e) => setGenre(e.target.value)}
                                    startAdornment={
                                        <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    }
                                >
                                    {genres.map((g) => (
                                        <MenuItem key={g} value={g}>{g}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isPromotion}
                                        onChange={(e) => setIsPromotion(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CampaignIcon fontSize="small" color="primary" />
                                        <Typography variant="body2">Mark as Promotion</Typography>
                                    </Box>
                                }
                            />
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* Media Buttons */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    size="small"
                                    disabled={loading}
                                    startIcon={<PhotoCamera />}
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    Photo
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={(e) => setEmojiAnchor(e.currentTarget)}
                                    startIcon={<EmojiEmotionsIcon />}
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    Emoji
                                </Button>

                                {/* Emoji Picker */}
                                <EmojiPicker
                                    anchorEl={emojiAnchor}
                                    onClose={() => setEmojiAnchor(null)}
                                    onEmojiSelect={(emoji) => setContent(content + emoji)}
                                />
                            </Box>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                disabled={loading || (!content.trim() && !image)}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CreatePost;
