const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createDebugUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Delete existing debug user if any
        await User.deleteOne({ email: 'debug@example.com' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const newUser = new User({
            username: 'DebugUser',
            email: 'debug@example.com',
            password: hashedPassword,
            interests: ['testing']
        });

        await newUser.save();
        console.log(`DebugUser created. ID: ${newUser._id}`);
        console.log('Credentials: debug@example.com / password123');

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

createDebugUser();
