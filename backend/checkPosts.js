const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');

/**
 * Debug script to check posts in database
 * to verify isPromotion field values
 */
async function checkPosts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all posts
        const allPosts = await Post.find({});
        console.log(`\n=== Total Posts: ${allPosts.length} ===`);

        allPosts.forEach((post, index) => {
            console.log(`\nPost ${index + 1}:`);
            console.log(`  ID: ${post._id}`);
            console.log(`  Content: ${post.content?.substring(0, 50)}...`);
            console.log(`  isPromotion: ${post.isPromotion} (type: ${typeof post.isPromotion})`);
            console.log(`  Created: ${post.createdAt}`);
        });

        // Get only promotion posts
        const promotionPosts = await Post.find({ isPromotion: true });
        console.log(`\n=== Promotion Posts: ${promotionPosts.length} ===`);
        promotionPosts.forEach((post, index) => {
            console.log(`  ${index + 1}. ${post.content?.substring(0, 50)}...`);
        });

        // Get non-promotion posts
        const regularPosts = await Post.find({ isPromotion: false });
        console.log(`\n=== Regular Posts: ${regularPosts.length} ===`);

        // Posts without isPromotion field
        const postsWithoutField = await Post.find({ isPromotion: { $exists: false } });
        console.log(`\n=== Posts without isPromotion field: ${postsWithoutField.length} ===`);

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPosts();
