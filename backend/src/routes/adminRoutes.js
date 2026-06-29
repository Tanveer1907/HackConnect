const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hackathon = require('../models/Hackathon');
const Internship = require('../models/Internship');
const Admin = require('../models/Admin');
const isAdmin = require('../middleware/adminAuth');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hackconnect_admin',
        allowedFormats: ['jpeg', 'png', 'jpg', 'pdf']
    }
});
const upload = multer({ storage: storage });

// Setup Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 5000,
    socketTimeout: 5000
});

// @route   POST /api/admin/login
// @desc    Validate Admin credentials and send OTP
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if admin exists in MongoDB
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid Admin Credentials' });
        }

        // 2. Validate Password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Admin Credentials' });
        }

        // 3. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // 4. Save OTP to MongoDB
        await Admin.findOneAndUpdate({ email }, { otp, otpExpiry });

        // 5. Send OTP via Email (with fallback if cloud provider blocks outbound SMTP)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'HackConnect Enterprise - Admin Portal OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4F46E5; text-align: center;">HackConnect Admin</h2>
                    <p>You requested to log in to the HackConnect Enterprise Portal.</p>
                    <p>Your highly secure One-Time Password (OTP) is:</p>
                    <h1 style="text-align: center; letter-spacing: 5px; color: #111827; background: #F3F4F6; padding: 10px; border-radius: 5px;">${otp}</h1>
                    <p style="color: #6B7280; font-size: 12px; text-align: center;">This code will expire in 10 minutes. Do not share it with anyone.</p>
                </div>
            `
        };

        const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ 
                message: 'OTP sent successfully to registered admin email',
                ...(isDev && { devOtp: otp })
            });
        } catch (emailErr) {
            console.warn('Email sending blocked by cloud firewall:', emailErr.message);
            res.status(200).json({ 
                message: isDev 
                    ? 'OTP generated successfully! (Note: Live email sending is blocked by free hosting firewall. Use OTP shown below)'
                    : 'OTP generation completed. Please contact support if SMTP fails.',
                ...(isDev && { devOtp: otp })
            });
        }
    } catch (err) {
        console.error('Admin Login Error:', err);
        res.status(500).json({ message: 'Server error during admin login', error: err.message });
    }
});

// @route   POST /api/admin/verify
// @desc    Verify OTP and grant JWT Token
router.post('/verify', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        // Check if OTP matches and is not expired
        if (admin.otp !== otp || admin.otpExpiry < new Date()) {
            return res.status(401).json({ message: 'Invalid or Expired OTP' });
        }

        // Clear OTP from DB
        await Admin.findOneAndUpdate({ email }, { otp: null, otpExpiry: null });

        // Generate Token
        const token = jwt.sign(
            { id: admin.id || admin._id, role: 'admin' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '12h' }
        );

        // Set HttpOnly cookie for EJS SSR rendering
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in prod
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-domain between Vercel and Railway
            maxAge: 12 * 60 * 60 * 1000 // 12 hours
        });

        res.status(200).json({ message: 'OTP Verified', token });
    } catch (err) {
        console.error('OTP Verification Error:', err);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
});

// @route   POST /api/admin/upload
// @desc    Upload file to Cloudinary
router.post('/upload', isAdmin, upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ 
        message: 'File uploaded securely to Cloudinary', 
        url: req.file.path 
    });
});

// @route   POST /api/admin/hackathons
// @desc    Create a new hackathon with Cloudinary banner
router.post('/hackathons', isAdmin, upload.single('banner'), async (req, res) => {
    try {
        const { title, description, domain, deadline, mode, teamSize } = req.body;
        
        const newHackathon = new Hackathon({
            title,
            description,
            domain,
            deadline: deadline ? new Date(deadline) : null,
            mode,
            teamSize: parseInt(teamSize) || 4,
            image: req.file ? req.file.path : null // Cloudinary URL
        });

        await newHackathon.save();
        
        // Redirect back to the dashboard hackathons page
        res.redirect('/hackathons');
    } catch (err) {
        console.error('Error creating hackathon:', err);
        res.status(500).send('Server Error creating hackathon');
    }
});

// @route   POST /api/admin/hackathons/:id/delete
// @desc    Delete a hackathon
router.post('/hackathons/:id/delete', isAdmin, async (req, res) => {
    try {
        await Hackathon.findByIdAndDelete(req.params.id);
        res.redirect('/hackathons');
    } catch (err) {
        console.error('Error deleting hackathon:', err);
        res.status(500).send('Server Error deleting hackathon');
    }
});

// @route   GET /api/admin/moderation/pending
// @desc    Get all pending hackathons and internships
// @access  Admin
router.get('/moderation/pending', isAdmin, async (req, res) => {
    try {
        const hackathons = await Hackathon.find({ status: 'pending' }).sort({ createdAt: -1 });
        const internships = await Internship.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json({ hackathons, internships });
    } catch (err) {
        console.error('Error fetching pending items:', err);
        res.status(500).json({ message: 'Server error loading moderation queue' });
    }
});

// @route   PUT /api/admin/moderation/:type/:id/approve
// @desc    Approve a pending item (sets status to live)
// @access  Admin
router.put('/moderation/:type/:id/approve', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        if (type === 'hackathon') {
            await Hackathon.findByIdAndUpdate(id, { status: 'live' });
        } else if (type === 'internship') {
            await Internship.findByIdAndUpdate(id, { status: 'live' });
        } else {
            return res.status(400).json({ message: 'Invalid moderation type' });
        }
        res.json({ message: 'Item approved successfully and is now live!' });
    } catch (err) {
        console.error('Error approving item:', err);
        res.status(500).json({ message: 'Server error approving item' });
    }
});

// @route   PUT /api/admin/moderation/:type/:id/reject
// @desc    Reject/Archive a pending item (sets status to rejected)
// @access  Admin
router.put('/moderation/:type/:id/reject', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        if (type === 'hackathon') {
            await Hackathon.findByIdAndUpdate(id, { status: 'rejected' });
        } else if (type === 'internship') {
            await Internship.findByIdAndUpdate(id, { status: 'rejected' });
        } else {
            return res.status(400).json({ message: 'Invalid moderation type' });
        }
        res.json({ message: 'Item rejected and hidden from student feeds.' });
    } catch (err) {
        console.error('Error rejecting item:', err);
        res.status(500).json({ message: 'Server error rejecting item' });
    }
});

// @route   PUT /api/admin/moderation/:type/:id/edit
// @desc    Edit a pending item and optionally approve it
// @access  Admin
router.put('/moderation/:type/:id/edit', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.params;
        const updateData = req.body;
        
        let updatedItem;
        if (type === 'hackathon') {
            updatedItem = await Hackathon.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        } else if (type === 'internship') {
            updatedItem = await Internship.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        } else {
            return res.status(400).json({ message: 'Invalid moderation type' });
        }
        
        res.json({ message: 'Item details updated successfully!', item: updatedItem });
    } catch (err) {
        console.error('Error updating moderated item:', err);
        res.status(500).json({ message: 'Server error updating item' });
    }
});

module.exports = router;
