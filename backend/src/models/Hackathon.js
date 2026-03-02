const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true // e.g. 24hr, 48hr, themed
    },
    domain: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true // e.g. online, offline
    },
    deadline: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);
