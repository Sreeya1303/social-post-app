// Check if users exist in database
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Get all users
        const users = await User.find({}).select('username email createdAt');
        console.log(`\nTotal users in database: ${users.length}\n`);

        users.forEach((user, index) => {
            console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, ID: ${user._id}`);
        });

        process.exit(0);
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });
