/**
 * Toast Notification Utilities
 * Uses Sonner for beautiful toast notifications
 */

import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification wrapper
 */
export const toast = {
    /**
     * Show success toast
     * @param {string} message - Success message to display
     */
    success: (message) => {
        sonnerToast.success(message, {
            duration: 3000,
            position: 'top-right',
        });
    },

    /**
     * Show error toast
     * @param {string} message - Error message to display
     */
    error: (message) => {
        sonnerToast.error(message, {
            duration: 4000,
            position: 'top-right',
        });
    },

    /**
     * Show info toast
     * @param {string} message - Info message to display
     */
    info: (message) => {
        sonnerToast.info(message, {
            duration: 3000,
            position: 'top-right',
        });
    },

    /**
     * Show warning toast
     * @param {string} message - Warning message to display
     */
    warning: (message) => {
        sonnerToast.warning(message, {
            duration: 3000,
            position: 'top-right',
        });
    },

    /**
     * Show loading toast
     * @param {string} message - Loading message to display
     * @returns {string | number} Toast ID for dismissal
     */
    loading: (message) => {
        return sonnerToast.loading(message);
    },

    /**
     * Dismiss a toast by ID
     * @param {string | number} toastId - ID of toast to dismiss
     */
    dismiss: (toastId) => {
        sonnerToast.dismiss(toastId);
    },

    /**
     * Promise-based toast (shows loading, then success/error)
     * @param {Promise} promise - Promise to track
     * @param {Object} messages - Messages for loading, success, error states
     */
    promise: (promise, messages) => {
        sonnerToast.promise(promise, {
            loading: messages.loading || 'Loading...',
            success: messages.success || 'Success!',
            error: messages.error || 'Error occurred'
        });
        return promise;
    }
};

/**
 * Predefined toast messages for common scenarios
 */
export const ToastMessages = {
    // Authentication
    LOGIN_SUCCESS: 'Welcome back! 👋',
    LOGIN_ERROR: 'Invalid credentials. Please try again.',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Account created successfully! 🎉',
    REGISTER_ERROR: 'Failed to create account',

    // Meetings
    MEETING_LOGGED: 'Meeting logged successfully! ✅',
    MEETING_ERROR: 'Failed to log meeting',
    MEETING_UPDATED: 'Meeting updated successfully',
    MEETING_DELETED: 'Meeting deleted',

    // Sales
    SALE_TRACKED: 'Sale recorded successfully! 💰',
    SALE_ERROR: 'Failed to record sale',
    SALE_UPDATED: 'Sale updated successfully',
    SALE_DELETED: 'Sale deleted',

    // Samples
    SAMPLE_LOGGED: 'Sample distribution recorded! 📦',
    SAMPLE_ERROR: 'Failed to log sample distribution',

    // Uploads
    PHOTO_UPLOAD_SUCCESS: 'Photos uploaded successfully! 📸',
    PHOTO_UPLOAD_ERROR: 'Failed to upload photos',
    PHOTO_SIZE_ERROR: 'File size too large. Maximum 5MB per image.',

    // Location
    LOCATION_PERMISSION_DENIED: 'Location access denied. Please enable location services.',
    LOCATION_ERROR: 'Failed to get location',

    // Data Operations
    DATA_SAVED: 'Data saved successfully ✓',
    DATA_ERROR: 'Failed to save data',
    DATA_DELETED: 'Data deleted successfully',

    // Network
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',

    // Generic
    SUCCESS: 'Operation completed successfully!',
    ERROR: 'Something went wrong. Please try again.',
    LOADING: 'Processing...',
};

/**
 * Helper to show API error toasts
 * @param {Error} error - Error object from API call
 */
export function showAPIError(error) {
    const message = error.response?.data?.message
        || error.message
        || ToastMessages.ERROR;
    toast.error(message);
}

/**
 * Helper to show API success toasts
 * @param {Object} response - Response object from API call
 * @param {string} defaultMessage - Default success message
 */
export function showAPISuccess(response, defaultMessage = ToastMessages.SUCCESS) {
    const message = response?.data?.message || defaultMessage;
    toast.success(message);
}
