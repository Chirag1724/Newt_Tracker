const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
} = require('../controllers/meetingController');
const { uploadMultiple } = require('../middleware/upload');

// All routes require authentication
router.use(authenticateToken);

// Meeting routes
router.post('/upload-photos', uploadMultiple, (req, res) => {
    try {
        const photos = req.files.map(file => file.path);
        res.json({ success: true, photos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

router.post('/', uploadMultiple, createMeeting);
router.get('/', getAllMeetings);
router.get('/:id', getMeetingById);
router.put('/:id', uploadMultiple, updateMeeting);
router.delete('/:id', deleteMeeting);

module.exports = router;
