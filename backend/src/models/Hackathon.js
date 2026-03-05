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
    },
    { timestamps: true }
);

module.exports = mongoose.model('Hackathon', hackathonSchema);
