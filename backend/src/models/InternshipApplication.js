const mongoose = require('mongoose');

const internshipApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        internshipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Internship',
            required: true,
        },
        resumeUrl: {
            type: String, // Secure Cloudinary URL of the PDF resume
            required: true,
        },
        portfolio: {
            type: String, // Github, LinkedIn or personal portfolio URL
        },
        whyJoin: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['applied', 'reviewed', 'shortlisted', 'interviewing', 'accepted', 'rejected', 'withdrawn'],
            default: 'applied',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('InternshipApplication', internshipApplicationSchema);
