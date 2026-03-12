const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ─── IMAGE UPLOAD ────────────────────────────────────────────────────────────

const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'newt-tracker/meetings',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
    },
});

const upload = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

const uploadSingle = upload.single('photo');
const uploadMultiple = upload.array('photos', 5);

// ─── DOCUMENT UPLOAD (PDF / DOC / DOCX / XLS / XLSX / TXT) ─────────────────

const ALLOWED_DOC_MIMETYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
];

const ALLOWED_DOC_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'];

const documentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Derive a clean originalname-based public_id
        const safeName = file.originalname
            .replace(/\.[^.]+$/, '')          // strip extension
            .replace(/[^a-zA-Z0-9_-]/g, '_')  // sanitise
            .substring(0, 60);

        return {
            folder: 'newt-tracker/documents',
            resource_type: 'raw',             // Cloudinary raw = non-image
            public_id: `${safeName}_${Date.now()}`,
            // Preserve the original filename so the download link is clean
            use_filename: true,
            unique_filename: true,
        };
    },
});

const documentUpload = multer({
    storage: documentStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per file
    fileFilter: (req, file, cb) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (
            ALLOWED_DOC_MIMETYPES.includes(file.mimetype) ||
            ALLOWED_DOC_EXTENSIONS.includes(ext)
        ) {
            return cb(null, true);
        }
        cb(new Error(`Unsupported file type: ${ext}. Allowed: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV`), false);
    }
});

const uploadDocuments = documentUpload.array('documents', 10);

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Delete a file from Cloudinary.
 * @param {string} publicId
 * @param {'image'|'raw'} resourceType
 */
const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};

/** @deprecated Use deleteFile */
const deletePhoto = (publicId) => deleteFile(publicId, 'image');

const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return `newt-tracker/meetings/${publicId}`;
};

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadDocuments,
    deletePhoto,
    deleteFile,
    getPublicIdFromUrl,
    cloudinary,
};
