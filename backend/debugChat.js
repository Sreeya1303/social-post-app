const mongoose = require('mongoose');
const Message = require('./models/Message');
const User = require('./models/User');
require('dotenv').config();

const debugChat = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const fs = require('fs');
        const users = await User.find({}, 'username email _id');
        const userLog = users.map(u => `${u.username} (${u._id})`).join('\n');
        fs.writeFileSync('debug_users.txt', userLog);
        console.log('Wrote users to debug_users.txt');

        console.log('\n--- MESSAGES ---');
        const messages = await Message.find({});
        console.log(`Total Messages: ${messages.length}`);

        for (const msg of messages) {
            console.log(`
ID: ${msg._id}
Sender: ${msg.sender} (Type: ${typeof msg.sender})
Receiver: ${msg.receiver} (Type: ${typeof msg.receiver})
Content: ${msg.content}
CreatedAt: ${msg.createdAt}
            `);

            // Check implicit matching
            console.log(`Sender is ObjectId? ${msg.sender instanceof mongoose.Types.ObjectId}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
};

debugChat();
