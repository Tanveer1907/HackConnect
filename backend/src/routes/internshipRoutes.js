const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary for Resume Storage
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hackconnect_resumes',
        allowedFormats: ['pdf', 'doc', 'docx']
    }
});
const upload = multer({ storage: storage });

// @route   GET /api/internships
// @desc    Get all live internships
// @access  Public
router.get('/', internshipController.getInternships);

// @route   GET /api/internships/my-applications
// @desc    Get all applications submitted by logged-in student
// @access  Private
router.get('/my-applications', authMiddleware, internshipController.getMyApplications);

// @route   GET /api/internships/:id
// @desc    Get single internship by ID
// @access  Public
router.get('/:id', internshipController.getInternshipById);

// @route   POST /api/internships/:id/apply
// @desc    Apply to internship (accepts multipart/form-data with 'resume' file field)
// @access  Private
router.post('/:id/apply', authMiddleware, upload.single('resume'), internshipController.applyToInternship);

// @route   PUT /api/internships/application/:id/withdraw
// @desc    Withdraw internship application
// @access  Private
router.put('/application/:id/withdraw', authMiddleware, internshipController.withdrawApplication);

module.exports = router;
