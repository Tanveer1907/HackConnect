const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        hackathonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hackathon',
            required: true,
        },
        leaderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        pendingRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        status: {
            type: String,
            enum: ['Active', 'Full', 'Closed'],
            default: 'Active',
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
