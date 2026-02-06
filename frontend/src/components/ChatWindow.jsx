import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { messagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * ChatWindow Component
 * Displays the conversation with a specific user and allows sending messages
 */
const ChatWindow = ({ activeChat, onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [sending, setSending] = useState(false);

    // Fetch messages when activeChat changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeChat) return;

            try {
                setLoading(true);
                const response = await messagesAPI.getMessages(activeChat._id);
                setMessages(response.data.messages || []);

                // Mark as read
                await messagesAPI.markAsRead(activeChat._id);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Poll for new messages every 3 seconds (simulating real-time)
        const intervalId = setInterval(async () => {
            if (!activeChat) return;
            try {
                const response = await messagesAPI.getMessages(activeChat._id);
                // Only update if we have new messages (simple check by length for now)
                setMessages(prev => {
                    const newMessages = response.data.messages || [];
                    return newMessages.length > prev.length ? newMessages : prev;
                });
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [activeChat]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            setSending(true);
            await messagesAPI.sendMessage(activeChat._id, newMessage);

            // Optimistically add message or use response
            // Refresh messages to be safe and ensure consistent state
            const msgsResponse = await messagesAPI.getMessages(activeChat._id);
            setMessages(msgsResponse.data.messages);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert(`Failed to send: ${error.response?.data?.message || error.message}`);
        } finally {
            setSending(false);
        }
    };

    const handleDeleteChat = async () => {
        if (!activeChat) return;
        if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
            try {
                await messagesAPI.deleteConversation(activeChat._id);
                setMessages([]);
                onBack(); // Go back to list
            } catch (error) {
                console.error('Delete chat error:', error);
                alert('Failed to delete chat');
            }
        }
    };

    if (!activeChat) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: 'text.secondary' }}>
                <Typography variant="h6">Select a conversation</Typography>
                <Typography variant="body2">Choose a user to start chatting</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Chat Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', bgcolor: '#fff' }}>
                <IconButton onClick={onBack} sx={{ mr: 1, display: { md: 'none' } }}>
                    <ArrowBackIcon />
                </IconButton>
                <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                    {activeChat.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>{activeChat.username}</Typography>

                <IconButton onClick={handleDeleteChat} color="error" title="Delete Conversation">
                    <DeleteIcon />
                </IconButton>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f0f2f5', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : messages.length === 0 ? (
                    <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                        No messages yet. Say hello!
                    </Typography>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender._id === user.id || msg.sender === user.id;
                        return (
                            <Box
                                key={msg._id}
                                sx={{
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    display: 'flex',
                                    flexDirection: isMe ? 'row' : 'row-reverse',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >


                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        bgcolor: isMe ? 'primary.main' : '#fff',
                                        color: isMe ? '#fff' : 'text.primary',
                                        borderRadius: 2,
                                        borderTopRightRadius: isMe ? 0 : 2,
                                        borderTopLeftRadius: isMe ? 2 : 0
                                    }}
                                >
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8, textAlign: 'right', fontSize: '0.7rem' }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Paper>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: 1 }}
            >
                <TextField
                    fullWidth
                    placeholder="Type a message..."
                    size="small"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ bgcolor: '#f8f9fa' }}
                    InputProps={{ sx: { borderRadius: 3 } }}
                />
                <IconButton
                    color="primary"
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.main' } }}
                >
                    {sending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatWindow;
