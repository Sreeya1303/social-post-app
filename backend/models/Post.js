const mongoose = require('mongoose');

/**
 * Post Schema
 * Stores social media posts with embedded likes and comments
 */
const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        trim: true,
        maxlength: [5000, 'Post content cannot exceed 5000 characters']
    },
    imageUrl: {
        type: String,
        default: null
    },
    isPromotion: {
        type: Boolean,
        default: false
    },
    genre: {
        type: String,
        enum: ['Technology', 'Sports', 'Music', 'Art', 'Food', 'Travel', 'Gaming', 'Fashion', 'Business', 'Health', 'Other'],
        default: 'Other'
    },
    // View tracking
    views: {
        type: Number,
        default: 0
    },
    uniqueViewers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Array of likes with user information
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Array of comments with user information
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Virtual field to get like count
 */
postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

/**
 * Virtual field to get comment count
 */
postSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

// Ensure virtuals are included when converting to JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Validation: At least one of content or imageUrl must be present
postSchema.pre('validate', function (next) {
    if (!this.content && !this.imageUrl) {
        next(new Error('Post must contain either text content or an image'));
    } else {
        next();
    }
});

module.exports = mongoose.model('Post', postSchema);
