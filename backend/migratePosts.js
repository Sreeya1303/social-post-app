const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');

/**
 * Migration script to add isPromotion field to existing posts
 * Sets isPromotion: false for all posts that don't have it
 */
async function migratePosts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update all posts that don't have isPromotion field
        const result = await Post.updateMany(
            { isPromotion: { $exists: false } },
            { $set: { isPromotion: false } }
        );

        console.log(`\nMigration complete!`);
        console.log(`Posts updated: ${result.modifiedCount}`);
        console.log(`Posts matched: ${result.matchedCount}`);

        // Verify
        const allPosts = await Post.find({});
        console.log(`\nVerification:`);
        console.log(`Total posts: ${allPosts.length}`);
        console.log(`Promotion posts: ${allPosts.filter(p => p.isPromotion === true).length}`);
        console.log(`Regular posts: ${allPosts.filter(p => p.isPromotion === false).length}`);

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

migratePosts();
