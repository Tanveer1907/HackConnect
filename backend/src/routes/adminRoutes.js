const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// Setup Prisma with PG adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

        // 1. Check if admin exists in Postgres
        const admin = await prisma.admin.findUnique({ where: { email } });
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

        // 4. Save OTP to Postgres
        await prisma.admin.update({
            where: { email },
            data: { otp, otpExpiry }
        });

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

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ 
                message: 'OTP sent successfully to registered admin email',
                devOtp: otp 
            });
        } catch (emailErr) {
            console.warn('Email sending blocked by cloud firewall (expected in trial tier):', emailErr.message);
            res.status(200).json({ 
                message: 'OTP generated successfully! (Note: Live email sending is blocked by free hosting firewall. Use OTP shown below)',
                devOtp: otp 
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

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        // Check if OTP matches and is not expired
        if (admin.otp !== otp || admin.otpExpiry < new Date()) {
            return res.status(401).json({ message: 'Invalid or Expired OTP' });
        }

        // Clear OTP from DB
        await prisma.admin.update({
            where: { email },
            data: { otp: null, otpExpiry: null }
        });

        // Generate Token
        const token = jwt.sign(
            { id: admin.id, role: 'admin' }, 
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
router.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ 
        message: 'File uploaded securely to Cloudinary', 
        url: req.file.path 
    });
});

module.exports = router;
