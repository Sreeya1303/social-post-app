import axios from 'axios';

/**
 * Axios instance configured for API calls
 * Base URL is set from environment variable
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Request interceptor to add auth token to requests
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle common errors
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Authentication API calls
 */
export const authAPI = {
    signup: (userData) => api.post('/auth/signup', userData),
    login: (credentials) => api.post('/auth/login', credentials)
};

/**
 * Posts API calls
 */
export const postsAPI = {
    createPost: (formData) => {
        return api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getAllPosts: (params = {}) => {
        console.log('API getAllPosts called with params:', params);
        return api.get('/posts', { params });
    },
    getMyPosts: () => api.get('/posts/my-posts'),
    likePost: (postId) => api.post(`/posts/${postId}/like`),
    commentOnPost: (postId, text) => api.post(`/posts/${postId}/comment`, { text }),
    deletePost: (postId) => api.delete(`/posts/${postId}`),
    trackView: (postId) => api.post(`/posts/${postId}/view`),
    deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comment/${commentId}`)
};

/**
 * Users API calls
 */
export const usersAPI = {
    getUserProfile: (userId) => api.get(`/users/${userId}/profile`),
    followUser: (userId) => api.post(`/users/${userId}/follow`),
    getFollowers: (userId) => api.get(`/users/${userId}/followers`),
    getFollowing: (userId) => api.get(`/users/${userId}/following`),
    searchUsers: (query) => api.get('/users/search', { params: { q: query } })
};

export const messagesAPI = {
    sendMessage: (receiverId, content) => api.post('/messages', { receiverId, content }),
    getConversations: () => api.get('/messages/conversations'),
    getMessages: (userId) => api.get(`/messages/${userId}`),
    markAsRead: (userId) => api.patch(`/messages/read/${userId}`),
    deleteConversation: (userId) => api.delete(`/messages/conversation/${userId}`)
};

export default api;
