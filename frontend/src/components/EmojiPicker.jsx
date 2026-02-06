import React, { useState } from 'react';
import { Box, Popover, IconButton, Typography } from '@mui/material';

/**
 * Simple Emoji Picker Component
 * Displays a grid of commonly used emojis
 */
const EmojiPicker = ({ onEmojiSelect, anchorEl, onClose }) => {
    // Common emojis organized by category
    const emojis = {
        smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛'],
        gestures: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍'],
        hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
        symbols: ['✨', '💫', '⭐', '🌟', '💥', '🔥', '💯', '✅', '❌', '⚡', '💡', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🎯', '📌', '📍'],
        nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌼', '🌱', '🌿', '🍀', '🌾', '🌵', '🌴', '🌳', '🌲', '☘️', '🍁', '🍂', '🍃', '🌊']
    };

    const [category, setCategory] = useState('smileys');

    const handleEmojiClick = (emoji) => {
        onEmojiSelect(emoji);
        onClose();
    };

    const open = Boolean(anchorEl);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <Box sx={{ p: 2, width: 320 }}>
                {/* Category Tabs */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                    {Object.keys(emojis).map((cat) => (
                        <Typography
                            key={cat}
                            variant="caption"
                            sx={{
                                cursor: 'pointer',
                                fontWeight: category === cat ? 700 : 400,
                                color: category === cat ? 'primary.main' : 'text.secondary',
                                textTransform: 'capitalize',
                                '&:hover': { color: 'primary.main' }
                            }}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </Typography>
                    ))}
                </Box>

                {/* Emoji Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                        gap: 0.5,
                        maxHeight: 200,
                        overflowY: 'auto',
                    }}
                >
                    {emojis[category].map((emoji, index) => (
                        <IconButton
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            sx={{
                                fontSize: '1.5rem',
                                p: 0.5,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    transform: 'scale(1.2)',
                                },
                                transition: 'transform 0.2s',
                            }}
                        >
                            {emoji}
                        </IconButton>
                    ))}
                </Box>
            </Box>
        </Popover>
    );
};

export default EmojiPicker;
