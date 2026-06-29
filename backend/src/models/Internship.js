const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
        },
        logo: {
            type: String, // Can be an emoji character or a Cloudinary image URL
        },
        role: {
            type: String,
            required: true,
        },
        location: {
            type: String,
        },
        mode: {
            type: String,
            enum: ['REMOTE', 'HYBRID', 'IN_OFFICE'],
            default: 'REMOTE',
        },
        stipend: {
            type: String,
        },
        duration: {
            type: String,
        },
        skills: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            required: true,
        },
        applyUrl: {
            type: String, // If it's an external link (like Internshala or Adzuna)
        },
        source: {
            type: String,
            default: 'manual',
        },
        sourceId: {
            type: String, // Unique ID from external API / Scraper to avoid duplicates
        },
        deadline: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'live', 'rejected'],
            default: 'live', // Manual posts default to live, scraped to pending
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Internship', internshipSchema);
