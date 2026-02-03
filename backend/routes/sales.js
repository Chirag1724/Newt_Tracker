const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    createSale,
    getAllSales,
    getSaleById,
    getSalesStats,
    deleteSale
} = require('../controllers/salesController');

// All routes require authentication
router.use(authenticateToken);

// Sales routes
router.post('/', createSale);
router.get('/', getAllSales);
router.get('/stats', getSalesStats);
router.get('/:id', getSaleById);
router.delete('/:id', deleteSale);

module.exports = router;
