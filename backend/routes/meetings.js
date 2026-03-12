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
const { uploadMultiple, uploadDocuments } = require('../middleware/upload');

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

// Document upload route – supports PDF, DOC, DOCX, XLS, XLSX, TXT, CSV
router.post('/upload-documents', uploadDocuments, (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No documents uploaded' });
        }
        const documents = req.files.map(file => ({
            url: file.path,           // Cloudinary secure URL
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            public_id: file.filename, // Cloudinary public_id
        }));
        res.json({ success: true, documents });
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ success: false, message: error.message || 'Document upload failed' });
    }
});

router.post('/', uploadMultiple, createMeeting);
router.get('/', getAllMeetings);
router.get('/:id', getMeetingById);
router.put('/:id', uploadMultiple, updateMeeting);
router.delete('/:id', deleteMeeting);

module.exports = router;
