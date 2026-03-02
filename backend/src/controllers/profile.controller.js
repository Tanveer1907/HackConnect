const User = require('../models/User');

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { skills, preferredRole, achievements, college } = req.body;

        let updateFields = {};
        if (skills) updateFields.skills = skills;
        if (preferredRole) updateFields.preferredRole = preferredRole;
        if (achievements) updateFields.achievements = achievements;
        if (college !== undefined) updateFields.college = college;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};
