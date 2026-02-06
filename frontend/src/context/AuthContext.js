import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Custom hook to use auth context
 * Must be used within AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

/**
 * AuthProvider Component
 * Manages authentication state and provides auth functions
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Login function
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<object>} User data
     */
    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token: newToken, user: newUser } = response.data;

            // Store token and user in localStorage
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));

            // Update state
            setToken(newToken);
            setUser(newUser);

            return newUser;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Signup function
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<object>} User data
     */
    const signup = async (username, email, password) => {
        try {
            const response = await authAPI.signup({ username, email, password });
            const { token: newToken, user: newUser } = response.data;

            // Store token and user in localStorage
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));

            // Update state
            setToken(newToken);
            setUser(newUser);

            return newUser;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Logout function
     * Clears authentication state and localStorage
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
