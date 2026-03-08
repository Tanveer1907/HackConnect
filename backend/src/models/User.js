const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        skills: [
            {
                name: { type: String, required: true },
                level: { type: Number, default: 50 },
                type: { type: String, default: 'Intermediate' }
            }
        ],
        bio: {
            type: String,
            default: '',
        },
        university: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            default: '',
        },
        lookingForTeam: {
            type: Boolean,
            default: false,
        },
        profileImage: {
            type: String,
            default: '',
        },
        authProvider: {
            type: String,
            default: 'local',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
