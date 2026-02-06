const mongoose = require('mongoose');
const Message = require('./models/Message');
const User = require('./models/User');
require('dotenv').config();

const userId = '698330d5c79a175d37862cae'; // K.Sreeya

const testAgg = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected. Testing for User: ${userId} (${typeof userId})`);

        // Exact pipeline from messages.js
        const pipeline = [
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
        ];

        console.log('Running aggregation...');
        const results = await Message.aggregate(pipeline);
        console.log(`Found ${results.length} conversations.`);

        if (results.length > 0) {
            console.log('Sample conversation:', JSON.stringify(results[0], null, 2));
        } else {
            // Debug MATCH stage only
            console.log('--- Debugging Match Stage ---');
            const matchResults = await Message.find({
                $or: [
                    { sender: new mongoose.Types.ObjectId(userId) },
                    { receiver: new mongoose.Types.ObjectId(userId) }
                ]
            });
            console.log(`Match Stage Found: ${matchResults.length} raw messages`);
        }

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
};

testAgg();
