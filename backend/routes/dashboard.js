const express = require('express');
const router = express.Router();
const { getAdminDashboard, getDistributorDashboard, getAnalytics } = require('../controllers/dashboardController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * @route   GET /api/dashboard/admin
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/admin', authenticateToken, authorizeRole('admin'), getAdminDashboard);

/**
 * @route   GET /api/dashboard/distributor
 * @desc    Get distributor dashboard statistics
 * @access  Private (Distributor only)
 */
router.get('/distributor', authenticateToken, authorizeRole('distributor'), getDistributorDashboard);

/**
 * @route   GET /api/dashboard/analytics
 * @desc    Get detailed analytics
 * @access  Private (Admin only)
 */
router.get('/analytics', authenticateToken, authorizeRole('admin'), getAnalytics);

module.exports = router;
