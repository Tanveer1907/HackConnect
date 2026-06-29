const Internship = require('../models/Internship');
const InternshipApplication = require('../models/InternshipApplication');

/**
 * Retrieves all approved (live) internships, allowing search, filtering, and sorting.
 */
exports.getInternships = async (req, res) => {
    try {
        const query = { status: 'live' };

        // 1. Filter by work mode (REMOTE, HYBRID, IN_OFFICE)
        if (req.query.mode) {
            query.mode = req.query.mode.toUpperCase();
        }

        // 2. Filter by search query (checks company, role, or description)
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            query.$or = [
                { company: searchRegex },
                { role: searchRegex },
                { description: searchRegex }
            ];
        }

        // 3. Filter by specific skill requirements
        if (req.query.skill) {
            query.skills = { $regex: req.query.skill, $options: 'i' };
        }

        const internships = await Internship.find(query).sort({ createdAt: -1 });
        console.log(`[getInternships] Found ${internships.length} live internships`);
        res.json(internships);
    } catch (error) {
        console.error('[getInternships] Error:', error);
        res.status(500).json({ message: 'Server Error loading internships' });
    }
};

/**
 * Retrieves a single internship by its unique MongoDB ObjectId.
 */
exports.getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }
        res.json(internship);
    } catch (error) {
        console.error('[getInternshipById] Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Internship not found' });
        }
        res.status(500).json({ message: 'Server Error loading internship details' });
    }
};

/**
 * Handles student resume submissions.
 */
exports.applyToInternship = async (req, res) => {
    try {
        const { portfolio, whyJoin } = req.body;
        const resumeUrl = req.file ? req.file.path : req.body.resumeUrl;

        // Basic inputs check
        if (!resumeUrl) {
            return res.status(400).json({ message: 'Please upload a resume (PDF)' });
        }
        if (!whyJoin || !whyJoin.trim()) {
            return res.status(400).json({ message: 'Please explain why you want to join' });
        }

        // Check if internship exists and is live
        const internship = await Internship.findById(req.params.id);
        if (!internship || internship.status !== 'live') {
            return res.status(404).json({ message: 'Internship not found or is no longer accepting applications' });
        }

        // Check if user has already applied
        const alreadyApplied = await InternshipApplication.findOne({
            userId: req.user.user.id,
            internshipId: req.params.id
        });
        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied to this internship' });
        }

        const newApplication = new InternshipApplication({
            userId: req.user.user.id,
            internshipId: req.params.id,
            resumeUrl,
            portfolio,
            whyJoin
        });

        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
    } catch (error) {
        console.error('[applyToInternship] Error:', error);
        res.status(500).json({ message: 'Server Error submitting application' });
    }
};

/**
 * Retrieves all internship applications submitted by the authenticated student.
 */
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await InternshipApplication.find({ userId: req.user.user.id })
            .populate('internshipId')
            .sort({ createdAt: -1 });
        
        res.json(applications);
    } catch (error) {
        console.error('[getMyApplications] Error:', error);
        res.status(500).json({ message: 'Server Error retrieving applications' });
    }
};

/**
 * Withdraws a previously submitted application.
 */
exports.withdrawApplication = async (req, res) => {
    try {
        const application = await InternshipApplication.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Authorization check: ensure application belongs to the logged-in student
        if (application.userId.toString() !== req.user.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        application.status = 'withdrawn';
        await application.save();

        res.json({ message: 'Application withdrawn successfully', application });
    } catch (error) {
        console.error('[withdrawApplication] Error:', error);
        res.status(500).json({ message: 'Server Error withdrawing application' });
    }
};
