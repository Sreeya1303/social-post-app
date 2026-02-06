import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    IconButton,
    Box,
    Divider,
    TextField,
    Button,
    Tooltip,
    Collapse,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    DialogActions
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import CampaignIcon from '@mui/icons-material/Campaign';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { formatRelativeTime, getImageUrl } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';

/**
 * PostCard Component
 * Displays a single post with like and comment functionality
 */
const PostCard = ({ post, onPostUpdated }) => {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Check if current user has liked the post
    const isLiked = post.likes?.some(like => like.userId === user.id);
    const likeCount = post.likes?.length || 0;
    const commentCount = post.comments?.length || 0;

    /**
     * Handle like/unlike
     */
    const handleLike = async () => {
        try {
            await postsAPI.likePost(post._id);
            if (onPostUpdated) {
                onPostUpdated();
            }
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    /**
     * Handle comment submission
     */
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setSubmitting(true);
        try {
            await postsAPI.commentOnPost(post._id, commentText.trim());
            setCommentText('');
            setShowComments(true);
            if (onPostUpdated) {
                onPostUpdated();
            }
        } catch (error) {
            console.error('Failed to comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Handle delete post
     */
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await postsAPI.deletePost(post._id);
            setDeleteDialogOpen(false);
            if (onPostUpdated) {
                onPostUpdated(); // Refresh the posts list
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert(error.response?.data?.message || 'Failed to delete post');
            setDeleteDialogOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    /**
     * Handle delete comment
     */
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await postsAPI.deleteComment(post._id, commentId);
            if (onPostUpdated) {
                onPostUpdated();
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert(error.response?.data?.message || 'Failed to delete comment');
        }
    };

    // Check if current user is the post owner
    const isOwner = post.userId === user.id;

    return (
        <Card
            elevation={3}
            sx={{
                mb: 3,
                borderRadius: 3,
                border: post.isPromotion ? '2px solid transparent' : '1px solid #e0e0e0',
                backgroundImage: post.isPromotion
                    ? 'linear-gradient(white, white), linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                    : 'none',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    boxShadow: post.isPromotion
                        ? '0 12px 40px rgba(250, 112, 154, 0.25)'
                        : '0 12px 40px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-4px)'
                },
                animation: 'fadeIn 0.5s ease-out',
            }}
        >
            {/* Card Header */}
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, fontSize: '1.2rem' }}>
                        {post.username?.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {post.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            @{post.username.toLowerCase()}
                        </Typography>
                    </Box>
                }
                subheader={
                    <Typography variant="caption" color="text.secondary">
                        {formatRelativeTime(post.createdAt)}
                    </Typography>
                }
                action={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {post.isPromotion && (
                            <Chip
                                label="Promoted"
                                size="small"
                                icon={<CampaignIcon />}
                                color="secondary"
                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                            />
                        )}
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2
                            }}
                        >
                            Follow
                        </Button>
                        {isOwner && (
                            <Tooltip title="Delete post">
                                <IconButton
                                    onClick={() => setDeleteDialogOpen(true)}
                                    size="small"
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'error.main',
                                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                }
                sx={{ pb: 1 }}
            />

            {/* Post Content */}
            <CardContent sx={{ pt: 0 }}>
                {post.content && (
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.95rem' }}>
                        {post.content}
                    </Typography>
                )}

                {/* Post Image */}
                {post.imageUrl && (
                    <Box
                        component="img"
                        src={getImageUrl(post.imageUrl)}
                        alt="Post content"
                        sx={{
                            width: '100%',
                            maxHeight: 500,
                            objectFit: 'cover',
                            borderRadius: 3,
                            border: '1px solid #e0e0e0'
                        }}
                    />
                )}
            </CardContent>

            {/* Like and Comment Actions */}
            <CardActions disableSpacing sx={{ px: 2, pb: 2 }}>
                {/* Like Button */}
                <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                    <IconButton
                        onClick={handleLike}
                        color={isLiked ? 'error' : 'default'}
                        sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
                    >
                        {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                </Tooltip>
                <Typography variant="body2" sx={{ mr: 3 }} fontWeight={500}>
                    {likeCount}
                </Typography>

                {/* Comment Button */}
                <IconButton
                    onClick={() => setShowComments(!showComments)}
                    sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
                >
                    <CommentIcon />
                </IconButton>
                <Typography variant="body2" fontWeight={500}>
                    {commentCount}
                </Typography>
            </CardActions>

            <Divider sx={{ mx: 2 }} />

            {/* Comments Section */}
            <Collapse in={showComments} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                    {/* Comment Input */}
                    <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                            {user.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={submitting}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'white' } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            disabled={!commentText.trim() || submitting}
                            endIcon={<SendIcon />}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Send
                        </Button>
                    </Box>

                    {/* Comments List */}
                    {post.comments && post.comments.length > 0 && (
                        <List sx={{ pt: 1 }}>
                            {post.comments.map((comment, index) => {
                                const isCommentOwner = comment.userId === user.id;
                                return (
                                    <ListItem
                                        key={comment._id || index}
                                        alignItems="flex-start"
                                        sx={{ px: 0, py: 1.5, bgcolor: 'white', borderRadius: 2, mb: 1 }}
                                        secondaryAction={
                                            (isCommentOwner && (
                                                <Box sx={{ display: 'flex' }}>
                                                    <Tooltip title="Reply">
                                                        <IconButton
                                                            edge="end"
                                                            size="small"
                                                            onClick={() => setCommentText((prev) => `> @${comment.username}: "${comment.text.substring(0, 30)}${comment.text.length > 30 ? '...' : ''}"\n\n` + prev)}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            <ReplyIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete comment">
                                                        <IconButton
                                                            edge="end"
                                                            size="small"
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            sx={{
                                                                color: 'text.secondary',
                                                                '&:hover': {
                                                                    color: 'error.main',
                                                                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                                                },
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            )) || (
                                                <Tooltip title="Reply">
                                                    <IconButton
                                                        edge="end"
                                                        size="small"
                                                        onClick={() => setCommentText((prev) => `> @${comment.username}: "${comment.text.substring(0, 30)}${comment.text.length > 30 ? '...' : ''}"\n\n` + prev)}
                                                    >
                                                        <ReplyIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )
                                        }
                                    >
                                        <ListItemAvatar sx={{ minWidth: 44 }}>
                                            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                                                {comment.username?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ m: 0, px: 1, pr: isCommentOwner ? 6 : 1 }}
                                            primary={
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    {comment.username}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" component="span" sx={{ display: 'block', mt: 0.5, color: 'text.primary' }}>
                                                        {comment.text}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                        {formatRelativeTime(comment.createdAt)}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Box>
            </Collapse>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => !deleting && setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Post?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default PostCard;
