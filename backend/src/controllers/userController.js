const User = require('../models/User');

exports.getCurrentUserProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const user = await User.findById(req.user.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { name, university, location, role, skills, bio, lookingForTeam, profileImage } = req.body;

        const profileFields = {};
        if (name) profileFields.name = name;
        if (university !== undefined) profileFields.university = university;
        if (location !== undefined) profileFields.location = location;
        if (role !== undefined) profileFields.role = role;
        if (skills !== undefined) profileFields.skills = Array.isArray(skills) ? skills : [];
        if (bio !== undefined) profileFields.bio = bio;
        if (lookingForTeam !== undefined) profileFields.lookingForTeam = lookingForTeam;
        if (profileImage !== undefined) profileFields.profileImage = profileImage;

        // Determine profile completion
        const skillsArr = Array.isArray(skills) ? skills : [];
        const validSkills = skillsArr.filter(s => s && (typeof s === 'string' ? s.trim() : s.name?.trim()));
        if (university || validSkills.length > 0 || req.body.isProfileCompleted) {
            profileFields.isProfileCompleted = true;
        }

        const user = await User.findByIdAndUpdate(
            req.user.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getRecommendedTeammates = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.user.id);
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const potentialTeammates = await User.find({
            _id: { $ne: currentUser._id },
            lookingForTeam: true
        }).select('-password');

        const mySkillNames = (currentUser.skills || []).map(s => (s.name || s).toLowerCase().trim());

        const recommendations = potentialTeammates.map(user => {
            const theirSkills = (user.skills || []).map(s => (s.name || s).toLowerCase().trim());
            const shared = theirSkills.filter(s => mySkillNames.includes(s));
            const union = new Set([...mySkillNames, ...theirSkills]);

            let matchScore = 25; // baseline interest
            if (union.size > 0 && mySkillNames.length > 0) {
                const jaccard = shared.length / union.size;
                matchScore = Math.min(98, Math.round(25 + (jaccard * 73)));
                if (shared.length > 0 && matchScore < 50) {
                    matchScore = Math.min(98, 50 + (shared.length * 10));
                }
            }

            return {
                ...user.toObject(),
                matchScore
            };
        });

        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        res.json(recommendations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }
        const user = await User.findById(req.user.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profileImage = req.file.path;
        await user.save();

        res.json({ message: 'Profile picture updated successfully', profileImage: user.profileImage, user });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ message: 'Failed to upload avatar: ' + error.message });
    }
};
