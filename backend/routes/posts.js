const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

/**
 * Multer configuration for image uploads
 * Stores files in uploads/ directory with unique filenames
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Protected
 */
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { content, isPromotion, genre } = req.body;
        const userId = req.user.id;
        const username = req.user.username;

        // Check validation
        if (!content && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Post must contain either text or an image'
            });
        }

        // Debug logging
        console.log('isPromotion received:', isPromotion, typeof isPromotion);
        const promotionValue = isPromotion === 'true' || isPromotion === true;
        console.log('isPromotion final value:', promotionValue);

        // Create new post
        const newPost = new Post({
            userId,
            username,
            content,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
            isPromotion: isPromotion === 'true',
            genre: genre || 'Other'
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        console.error('Create post error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating post'
        });
    }
});

/**
 * @route   GET /api/posts
 * @desc    Get all posts (public feed)
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { isPromotion, genre } = req.query;

        // Build query filter
        const filter = {};
        if (isPromotion !== undefined) {
            filter.isPromotion = isPromotion === 'true';
        }
        if (genre) {
            filter.genre = genre;
        }

        // Debug logging
        console.log('GET /posts - isPromotion query param:', isPromotion);
        console.log('GET /posts - filter object:', JSON.stringify(filter));

        // Fetch posts with optional filtering, sorted by newest first
        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .lean(); // Use lean for better performance

        console.log(`Found ${posts.length} posts`);

        res.json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching posts'
        });
    }
});

/**
 * @route   POST /api/posts/:id/like
 * @desc    Toggle like on a post
 * @access  Protected
 */
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user already liked the post
        const likeIndex = post.likes.findIndex(
            like => like.userId.toString() === req.user.id
        );

        if (likeIndex > -1) {
            // User already liked - remove like (unlike)
            post.likes.splice(likeIndex, 1);
        } else {
            // Add new like
            post.likes.push({
                userId: req.user.id,
                username: req.user.username
            });
        }

        await post.save();

        res.json({
            success: true,
            message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
            post
        });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while processing like'
        });
    }
});

/**
 * @route   POST /api/posts/:id/comment
 * @desc    Add a comment to a post
 * @access  Protected
 */
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Comment text is required'
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Add comment to post
        post.comments.push({
            userId: req.user.id,
            username: req.user.username,
            text: text.trim()
        });

        await post.save();

        res.json({
            success: true,
            message: 'Comment added successfully',
            post
        });
    } catch (error) {
        console.error('Comment post error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while adding comment'
        });
    }
});

/**
 * @route   GET /api/posts/my-posts
 * @desc    Get current user's posts
 * @access  Protected
 */
router.get('/my-posts', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        console.error('Get my posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching your posts'
        });
    }
});

/**
 * @route   POST /api/posts/:id/view
 * @desc    Track post view
 * @access  Protected
 */
router.post('/:id/view', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user already viewed this post
        const alreadyViewed = post.uniqueViewers.some(
            viewer => viewer.userId && viewer.userId.toString() === req.user.id
        );

        if (!alreadyViewed) {
            // Increment view count
            post.views += 1;
            // Add to unique viewers
            post.uniqueViewers.push({
                userId: req.user.id
            });
            await post.save();
        }

        res.json({
            success: true,
            views: post.views,
            message: alreadyViewed ? 'Already viewed' : 'View tracked'
        });
    } catch (error) {
        console.error('Track view error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while tracking view'
        });
    }
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Protected (post owner only)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user is the post owner
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this post'
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting post'
        });
    }
});

/**
 * @route   DELETE /api/posts/:id/comment/:commentId
 * @desc    Delete a comment from a post
 * @access  Protected (comment owner only)
 */
router.delete('/:id/comment/:commentId', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Find the comment
        const comment = post.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the comment owner
        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this comment'
            });
        }

        // Remove the comment
        comment.remove();
        await post.save();

        res.json({
            success: true,
            message: 'Comment deleted successfully',
            post
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting comment'
        });
    }
});

module.exports = router;
