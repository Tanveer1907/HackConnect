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

        const mySkillNames = currentUser.skills.map(s => s.name.toLowerCase());

        const recommendations = potentialTeammates.map(user => {
            let matchScore = 0;
            user.skills.forEach(skill => {
                if (mySkillNames.includes(skill.name.toLowerCase())) {
                    matchScore += 10;
                }
            });
            
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
