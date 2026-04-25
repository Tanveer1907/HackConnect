const Hackathon = require('../models/Hackathon');

exports.getHackathons = async (req, res) => {
    try {
        const hackathons = await Hackathon.find().sort({ createdAt: -1 });
        res.json(hackathons);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getHackathonById = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }
        res.json(hackathon);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Hackathon not found' });
        }
        res.status(500).send('Server Error');
    }
};
