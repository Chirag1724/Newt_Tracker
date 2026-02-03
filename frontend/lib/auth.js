import api from './api';

/**
 * Login user and store credentials
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} Login response with user and token
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });

        if (response.data.success) {
            // Store token and user in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

/**
 * Register new user and auto-login
 * @param {Object} userData - User registration data
 * @returns {Promise} Registration response with user and token
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);

        if (response.data.success) {
            // Auto-login: Store token and user in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};

/**
 * Logout user and clear credentials
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

/**
 * Get current token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
    return !!getToken();
};

/**
 * Fetch current user from API
 * @returns {Promise} User data
 */
export const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');

        if (response.data.success) {
            // Update user in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data.user;
        }
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch user' };
    }
};
