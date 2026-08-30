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

/**
 * Allows recruiters / users to create a new internship posting.
 */
exports.createInternship = async (req, res) => {
    try {
        const { company, role, location, mode, stipend, duration, skills, description, applyUrl, deadline, logo } = req.body;
        const userId = req.user.user.id;

        if (!company || !role || !description) {
            return res.status(400).json({ message: 'Company, role, and description are required' });
        }

        const parsedSkills = Array.isArray(skills) 
            ? skills 
            : typeof skills === 'string' 
                ? skills.split(',').map(s => s.trim()).filter(Boolean) 
                : [];

        const newInternship = new Internship({
            company,
            role,
            location: location || 'Remote',
            mode: mode ? mode.toUpperCase() : 'REMOTE',
            stipend: stipend || 'Competitive / Unpaid',
            duration: duration || '3 Months',
            skills: parsedSkills,
            description,
            applyUrl: applyUrl || '',
            deadline: deadline ? new Date(deadline) : null,
            logo: logo || '💼',
            postedBy: userId,
            status: 'live'
        });

        await newInternship.save();
        res.status(201).json({ message: 'Internship posted successfully!', internship: newInternship });
    } catch (error) {
        console.error('[createInternship] Error:', error);
        res.status(500).json({ message: 'Server Error posting internship' });
    }
};

/**
 * Retrieves all applicants for a specific internship (for poster / admin review).
 */
exports.getInternshipApplicants = async (req, res) => {
    try {
        const internshipId = req.params.id;
        const applications = await InternshipApplication.find({ internshipId })
            .populate('userId', 'name email university role skills profileImage bio')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('[getInternshipApplicants] Error:', error);
        res.status(500).json({ message: 'Server Error fetching applicants' });
    }
};

/**
 * Updates application status (reviewing, shortlisted, accepted, rejected).
 */
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['applied', 'reviewing', 'shortlisted', 'accepted', 'rejected', 'withdrawn'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const application = await InternshipApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        res.json({ message: `Application marked as ${status}`, application });
    } catch (error) {
        console.error('[updateApplicationStatus] Error:', error);
        res.status(500).json({ message: 'Server Error updating application status' });
    }
};
