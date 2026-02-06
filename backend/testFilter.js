// Simple test to verify API filtering
const http = require('http');

console.log('\n=== Testing Promotion Filter API ===\n');

// Test 1: Get all posts
http.get('http://localhost:5000/api/posts', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const result = JSON.parse(data);
        console.log(`✓ All Posts: ${result.count} posts`);

        // Test 2: Get only promotions
        http.get('http://localhost:5000/api/posts?isPromotion=true', (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
                const result2 = JSON.parse(data2);
                console.log(`✓ Promotion Posts: ${result2.count} posts`);

                if (result2.count === result.count) {
                    console.log('\n❌ ERROR: Filtering is NOT working! Same number of posts returned.');
                    console.log('   Backend is not filtering correctly.');
                } else {
                    console.log('\n✅ SUCCESS: Filtering IS working!');
                    console.log(`   Regular posts: ${result.count - result2.count}`);
                    console.log(`   Promotion posts: ${result2.count}`);
                }
                process.exit(0);
            });
        }).on('error', err => {
            console.error('Error:', err.message);
            process.exit(1);
        });
    });
}).on('error', err => {
    console.error('Error:', err.message);
    process.exit(1);
});
