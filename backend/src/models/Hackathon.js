const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        domain: {
            type: String,
        },
        deadline: {
            type: Date,
        },
        mode: {
            type: String,
        },
        teamSize: {
            type: Number,
        },
        image: {
            type: String,
        },
        source: {
            type: String,
            default: 'manual',
        },
        sourceId: {
            type: String,
        },
        sourceUrl: {
            type: String,
        },
        prizePool: {
            type: String,
        },
        participantCount: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'live', 'rejected'],
            default: 'live',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        submissions: [
            {
                submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                teamName: { type: String },
                projectTitle: { type: String, required: true },
                tagline: { type: String },
                description: { type: String },
                githubUrl: { type: String },
                demoUrl: { type: String },
                videoUrl: { type: String },
                techStack: [{ type: String }],
                submittedAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Hackathon', hackathonSchema);
