const Hackathon = require('../models/Hackathon');

exports.getHackathons = async (req, res) => {
    try {
        const query = {};
        
        // Allowed filters
        if (req.query.mode) query.mode = req.query.mode;
        if (req.query.domain) query.domain = req.query.domain;
        // In seed.js, there is no 'category' field on hackathon, but there is 'domain' and 'mode'
        // If they want keyword search:
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        const hackathons = await Hackathon.find(query).sort({ createdAt: -1 });
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
