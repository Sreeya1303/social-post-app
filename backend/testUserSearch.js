// Test script to verify user search is working
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Get auth token first (replace with actual credentials)
async function testUserSearch() {
    try {
        console.log('Testing user search endpoint...\n');

        // 1. Login to get token
        console.log('Step 1: Logging in...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'skanduri5@gitam.in',
            password: 'password123'
        });

        const token = loginResponse.data.token;
        console.log('✓ Login successful\n');

        // 2. Test search with empty query
        console.log('Step 2: Testing empty search...');
        const emptyResponse = await axios.get(`${API_URL}/users/search?q=`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✓ Empty search result:', emptyResponse.data);
        console.log('');

        // 3. Test search with actual username
        console.log('Step 3: Testing search for "sree"...');
        const searchResponse = await axios.get(`${API_URL}/users/search?q=sree`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✓ Search results:', JSON.stringify(searchResponse.data, null, 2));
        console.log('');

        // 4. Test search for another user
        console.log('Step 4: Testing search for "k"...');
        const searchResponse2 = await axios.get(`${API_URL}/users/search?q=k`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✓ Search results:', JSON.stringify(searchResponse2.data, null, 2));
        console.log('');

        console.log('✅ All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testUserSearch();
