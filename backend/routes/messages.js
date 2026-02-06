const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth');

/**
 * @route   POST /api/messages
 * @desc    Send a message
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        console.log('POST /messages body:', req.body);
        const { receiverId, content } = req.body;
        const senderId = req.user.id;
        console.log('Sender:', senderId, 'Receiver:', receiverId);

        if (!receiverId || !content) {
            return res.status(400).json({
                success: false,
                message: 'Receiver ID and content are required'
            });
        }

        // Verify receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content
        });

        await newMessage.save();

        // Populate sender details for immediate display on frontend
        await newMessage.populate('sender', 'username profilePicture');

        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending message'
        });
    }
});

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all conversations (latest message from each user)
 * @access  Private
 */
router.get('/conversations', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        console.log('GET /conversations for user:', userId, 'Type:', typeof userId);

        // Enable Mongoose Debugging to see exact query
        mongoose.set('debug', true);

        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(userId) },
                        { receiver: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                            '$receiver',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                                        { $eq: ['$isRead', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $unwind: '$contact'
            },
            {
                $project: {
                    'contact.password': 0,
                    'contact.email': 0,
                    'contact.__v': 0
                }
            },
            {
                $sort: { 'lastMessage.createdAt': -1 }
            }
        ]);

        console.log(`Found ${conversations.length} conversations for ${userId}`);

        // Disable debug after query to avoid noise
        mongoose.set('debug', false);

        res.json({
            success: true,
            conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching conversations'
        });
    }
});

/**
 * @route   GET /api/messages/:userId
 * @desc    Get conversation with a specific user
 * @access  Private
 */
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'username profilePicture')
            .populate('receiver', 'username profilePicture');

        res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching messages'
        });
    }
});

/**
 * @route   PATCH /api/messages/read/:userId
 * @desc    Mark all messages from a user as read
 * @access  Private
 */
router.patch('/read/:userId', authMiddleware, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        await Message.updateMany(
            {
                sender: otherUserId,
                receiver: currentUserId,
                isRead: false
            },
            {
                $set: { isRead: true, readAt: new Date() }
            }
        );

        res.json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        console.error('Mark messages read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

/**
 * @route   DELETE /api/messages/conversation/:userId
 * @desc    Delete conversation with a specific user
 * @access  Private
 */
router.delete('/conversation/:userId', authMiddleware, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;

        await Message.deleteMany({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        });

        res.json({
            success: true,
            message: 'Conversation deleted'
        });
    } catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
