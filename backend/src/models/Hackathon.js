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
    },
    { timestamps: true }
);

module.exports = mongoose.model('Hackathon', hackathonSchema);
