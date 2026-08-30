const Hackathon = require('../models/Hackathon');

exports.getHackathons = async (req, res) => {
    try {
        const query = {};
        
        // Allowed filters
        if (req.query.mode) query.mode = { $regex: req.query.mode, $options: 'i' };
        if (req.query.domain) query.domain = { $regex: req.query.domain, $options: 'i' };
        // In seed.js, there is no 'category' field on hackathon, but there is 'domain' and 'mode'
        // If they want keyword search:
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        const hackathons = await Hackathon.find(query).sort({ createdAt: -1 });
        console.log(`[getHackathons] Query:`, query);
        console.log(`[getHackathons] Found ${hackathons.length} hackathons`);
        res.json(hackathons);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getHackathonById = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id)
            .populate('registeredUsers', 'name email profileImage')
            .populate('submissions.submittedBy', 'name email profileImage');
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

exports.createHackathon = async (req, res) => {
    try {
        const { title, description, domain, deadline, mode, teamSize, prizePool, image, startDate, sourceUrl } = req.body;
        const userId = req.user?.user?.id;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const hackathon = new Hackathon({
            title,
            description,
            domain: domain || 'General',
            deadline: deadline ? new Date(deadline) : null,
            startDate: startDate ? new Date(startDate) : new Date(),
            mode: mode || 'ONLINE',
            teamSize: Number(teamSize) || 4,
            prizePool: prizePool || '$5,000',
            image: image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
            sourceUrl: sourceUrl || '',
            createdBy: userId,
            status: 'live'
        });

        await hackathon.save();
        res.status(201).json({ message: 'Hackathon published successfully!', hackathon });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.registerForHackathon = async (req, res) => {
    try {
        const hackathonId = req.params.id;
        const userId = req.user.user.id;

        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }

        const alreadyRegistered = hackathon.registeredUsers.some(id => id.toString() === userId);
        if (alreadyRegistered) {
            return res.status(400).json({ message: 'You are already registered for this hackathon' });
        }

        hackathon.registeredUsers.push(userId);
        hackathon.participantCount = (hackathon.participantCount || 0) + 1;
        await hackathon.save();

        res.json({ message: 'Registered for hackathon successfully!', hackathon });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.submitProject = async (req, res) => {
    try {
        const hackathonId = req.params.id;
        const userId = req.user.user.id;
        const { projectTitle, tagline, description, githubUrl, demoUrl, videoUrl, techStack, teamName } = req.body;

        if (!projectTitle || !githubUrl) {
            return res.status(400).json({ message: 'Project title and GitHub URL are required' });
        }

        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }

        const parsedTechStack = Array.isArray(techStack) 
            ? techStack 
            : typeof techStack === 'string' 
                ? techStack.split(',').map(s => s.trim()).filter(Boolean) 
                : [];

        const newSubmission = {
            submittedBy: userId,
            teamName: teamName || 'Solo Hacker',
            projectTitle,
            tagline: tagline || '',
            description: description || '',
            githubUrl,
            demoUrl: demoUrl || '',
            videoUrl: videoUrl || '',
            techStack: parsedTechStack,
            submittedAt: new Date()
        };

        hackathon.submissions.push(newSubmission);
        await hackathon.save();

        res.status(201).json({ message: 'Project submitted successfully! Best of luck!', submission: newSubmission });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
