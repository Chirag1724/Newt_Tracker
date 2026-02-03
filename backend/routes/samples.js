const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    createSample,
    getAllSamples,
    getSampleById,
    deleteSample
} = require('../controllers/sampleController');

// All routes require authentication
router.use(authenticateToken);

// Sample distribution routes
router.post('/', createSample);
router.get('/', getAllSamples);
router.get('/:id', getSampleById);
router.delete('/:id', deleteSample);

module.exports = router;
