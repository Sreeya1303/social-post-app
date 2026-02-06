const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');

/**
 * Create a test promotion post to verify filtering
 */
async function createTestPromotion() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create a test promotion post
        const promotionPost = new Post({
            userId: new mongoose.Types.ObjectId(),
            username: 'TestUser',
            content: '🎉 TEST PROMOTION POST - This should ONLY appear in Promotions tab! 🎉',
            isPromotion: true
        });

        await promotionPost.save();
        console.log('\n✅ Created test promotion post:', promotionPost._id);

        // Verify counts
        const allPosts = await Post.find({});
        const promotionPosts = await Post.find({ isPromotion: true });
        const regularPosts = await Post.find({ isPromotion: false });

        console.log(`\n📊 Database Status:`);
        console.log(`Total posts: ${allPosts.length}`);
        console.log(`Promotion posts (isPromotion: true): ${promotionPosts.length}`);
        console.log(`Regular posts (isPromotion: false): ${regularPosts.length}`);

        console.log('\n🔍 Promotion Posts:');
        promotionPosts.forEach(p => {
            console.log(`  - "${p.content.substring(0, 50)}..." (isPromotion: ${p.isPromotion})`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Test complete! Now refresh browser and click "Promotions" tab.');
        console.log(`   You should see ONLY ${promotionPosts.length} post(s) with orange "Promoted" badge.`);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestPromotion();
