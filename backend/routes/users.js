const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

/**
 * @route   GET /api/users/search
 * @desc    Search users by username or email
 * @access  Protected
 */
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.json({
                success: true,
                users: []
            });
        }

        // Search for users whose username OR email contains the query (case-insensitive)
        const users = await User.find({
            $and: [
                // { _id: { $ne: req.user.id } }, // Exclude current user (COMMENTED OUT FOR TESTING)
                {
                    $or: [
                        { username: { $regex: q, $options: 'i' } },
                        { email: { $regex: q, $options: 'i' } }
                    ]
                }
            ]
        })
            .select('username email createdAt')
            .limit(10);

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching users'
        });
    }
});

/**
 * @route   GET /api/users/:userId/profile
 * @desc    Get user profile with stats
 * @access  Public
 */
router.get('/:userId/profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password').lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's post count
        const postCount = await Post.countDocuments({ userId: req.params.userId });

        // Get total likes received on user's posts
        const posts = await Post.find({ userId: req.params.userId }).select('likes').lean();
        const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);

        // Get total views on user's posts
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

        res.json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                followerCount: user.followers?.length || 0,
                followingCount: user.following?.length || 0,
                postCount,
                totalLikes,
                totalViews
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user profile'
        });
    }
});

/**
 * @route   POST /api/users/:userId/follow
 * @desc    Follow or unfollow a user
 * @access  Protected
 */
router.post('/:userId/follow', authMiddleware, async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user.id;

        // Can't follow yourself
        if (targetUserId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot follow yourself'
            });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already following
        const isFollowing = currentUser.following.some(
            f => f.userId.toString() === targetUserId
        );

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(
                f => f.userId.toString() !== targetUserId
            );
            targetUser.followers = targetUser.followers.filter(
                f => f.userId.toString() !== currentUserId
            );
        } else {
            // Follow
            currentUser.following.push({
                userId: targetUserId,
                username: targetUser.username
            });
            targetUser.followers.push({
                userId: currentUserId,
                username: currentUser.username
            });
        }

        await currentUser.save();
        await targetUser.save();

        res.json({
            success: true,
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing,
            followerCount: targetUser.followers.length
        });
    } catch (error) {
        console.error('Follow/unfollow error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while processing follow request'
        });
    }
});

/**
 * @route   GET /api/users/:userId/followers
 * @desc    Get user's followers
 * @access  Public
 */
router.get('/:userId/followers', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('followers').lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            followers: user.followers || []
        });
    } catch (error) {
        console.error('Get followers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching followers'
        });
    }
});

/**
 * @route   GET /api/users/:userId/following
 * @desc    Get users being followed
 * @access  Public
 */
router.get('/:userId/following', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('following').lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            following: user.following || []
        });
    } catch (error) {
        console.error('Get following error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching following'
        });
    }
});

module.exports = router;
