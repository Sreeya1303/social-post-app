import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    CircularProgress,
    Badge
} from '@mui/material';
import ChatWindow from '../components/ChatWindow';
import { messagesAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Chat Page Component
 * Manages conversation list and active chat window
 */
const Chat = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'

    useEffect(() => {
        // If query param 'userId' is present, fetch that user and set as temporary active chat
        // This handles "Start Chat" from profile or search
        const initChat = async () => {
            const startUserId = searchParams.get('userId');
            if (startUserId) {
                try {
                    const response = await usersAPI.getUserProfile(startUserId);
                    const userData = response.data.user;
                    setActiveChat({
                        _id: userData._id,
                        username: userData.username,
                        profilePicture: userData.profilePicture
                    });
                    setMobileView('chat');
                    // We don't return here, we still want to fetch existing conversations
                } catch (error) {
                    console.error('Error fetching start user:', error);
                }
            }
            fetchConversations();
        };

        initChat();
    }, [searchParams]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const response = await messagesAPI.getConversations();
            setConversations(response.data.conversations || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConversationClick = (contact) => {
        setActiveChat({
            _id: contact._id,
            username: contact.username,
            profilePicture: contact.profilePicture
        });
        setMobileView('chat');
    };

    const handleBackToList = () => {
        setMobileView('list');
        setActiveChat(null);
        fetchConversations(); // Refresh list to update unread counts or last messages
    };

    return (
        <Box sx={{ height: 'calc(100vh - 100px)' }}> {/* Adjusted height for layout */}
            <Container maxWidth="xl" sx={{ height: '100%', py: 0 }}>

                <Paper
                    elevation={2}
                    sx={{
                        height: '85vh',
                        display: 'flex',
                        overflow: 'hidden',
                        borderRadius: 4
                    }}
                >
                    {/* Conversation List Sidebar */}
                    <Box sx={{
                        width: { xs: '100%', md: '320px' },
                        borderRight: '1px solid #eee',
                        display: { xs: mobileView === 'list' ? 'block' : 'none', md: 'block' },
                        flexShrink: 0,
                        overflowY: 'auto'
                    }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                            <Typography variant="h6" fontWeight={700}>Messages</Typography>
                        </Box>

                        {loading && !activeChat ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : conversations.length === 0 ? (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography color="text.secondary">No conversations yet.</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Search for users to start chatting!
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {conversations.map((conv) => {
                                    const contact = conv.contact;
                                    const lastMsg = conv.lastMessage;
                                    const isUnread = conv.unreadCount > 0;

                                    return (
                                        <React.Fragment key={contact._id}>
                                            <ListItem
                                                button
                                                selected={activeChat?._id === contact._id}
                                                onClick={() => handleConversationClick(contact)}
                                                sx={{
                                                    bgcolor: activeChat?._id === contact._id ? '#f0f7ff' : 'transparent',
                                                    '&:hover': { bgcolor: '#f5f5f5' }
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Badge color="primary" variant="dot" invisible={!isUnread}>
                                                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                            {contact.username?.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                    </Badge>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography fontWeight={isUnread ? 700 : 400}>
                                                            {contact.username}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body2"
                                                            color={isUnread ? 'text.primary' : 'text.secondary'}
                                                            noWrap
                                                            fontWeight={isUnread ? 600 : 400}
                                                        >
                                                            {lastMsg.sender === user.id ? 'You: ' : ''}{lastMsg.content}
                                                        </Typography>
                                                    }
                                                />
                                                {isUnread && (
                                                    <Box
                                                        sx={{
                                                            bgcolor: 'primary.main',
                                                            color: 'white',
                                                            borderRadius: '50%',
                                                            width: 20,
                                                            height: 20,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {conv.unreadCount}
                                                    </Box>
                                                )}
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        )}
                    </Box>

                    {/* Main Chat Area */}
                    <Box sx={{
                        flex: 1,
                        display: { xs: mobileView === 'chat' ? 'block' : 'none', md: 'block' },
                        height: '100%'
                    }}>
                        <ChatWindow
                            activeChat={activeChat}
                            onBack={handleBackToList}
                        />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Chat;
