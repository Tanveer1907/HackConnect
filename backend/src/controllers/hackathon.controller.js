const Hackathon = require('../models/Hackathon');

exports.getHackathons = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        const hackathons = await Hackathon.find(query);
        res.json(hackathons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving hackathons' });
    }
};
