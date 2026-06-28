const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');
const Hackathon = require('./src/models/Hackathon');
const Team = require('./src/models/Team');

const defaultHackathons = [
    {
        title: 'Global Game Jam',
        description: 'Design and build a complete game in 48 hours. Team up with developers, artists, and sound designers worldwide to bring creative mechanics to life. This year\'s theme will be announced live at the opening ceremony.',
        domain: 'Game Development',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        mode: 'HYBRID',
        teamSize: 4,
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'
    },
    {
        title: 'Cyber Security Hackathon',
        description: 'Test your offensive and defensive security skills in capture-the-flag (CTF) challenges, vulnerability detection, and network analysis. Top security specialists from around the globe will oversee the challenge.',
        domain: 'Cybersecurity',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        mode: 'ONLINE',
        teamSize: 3,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'
    },
    {
        title: 'HealthTech Hack 2024',
        description: 'Build digital tools to enhance clinical workflow, patient diagnostics, or mental health access. Join medical doctors, software engineers, and product designers to solve real-world healthcare bottlenecks.',
        domain: 'HealthTech',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        mode: 'IN_PERSON',
        teamSize: 4,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
    },
    {
        title: 'FinTech Futures Hackathon',
        description: 'Design open-banking solutions, fraud detection algorithms, or micro-lending apps. Focus on financial inclusion, blockchain infrastructure, and frictionless digital payment mechanics.',
        domain: 'FinTech',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        mode: 'ONLINE',
        teamSize: 3,
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'
    },
    {
        title: 'EduTech Innovations',
        description: 'Reimagine virtual classrooms, gamified learning systems, or accessibility tools for education. Focus on delivering quality, personalized education opportunities globally.',
        domain: 'EduTech',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        mode: 'ONLINE',
        teamSize: 5,
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
    }
];

const mockUsersData = [
    {
        email: 'aarav.s@iitd.ac.in',
        name: 'Aarav Sharma',
        university: 'IIT Delhi',
        role: 'Full Stack Developer',
        bio: 'Love building React apps and Node.js backends. Won 2 local hackathons!',
        location: 'New Delhi',
        lookingForTeam: true,
        skills: [
            { name: 'React', level: 90, type: 'Expert' },
            { name: 'Node.js', level: 85, type: 'Expert' },
            { name: 'MongoDB', level: 80, type: 'Intermediate' }
        ]
    },
    {
        email: 'priya.v@iitb.ac.in',
        name: 'Priya Verma',
        university: 'IIT Bombay',
        role: 'UI/UX Designer',
        bio: 'Figma wizard. I design premium interfaces that feel alive and responsive.',
        location: 'Mumbai',
        lookingForTeam: true,
        skills: [
            { name: 'Figma', level: 95, type: 'Expert' },
            { name: 'CSS', level: 90, type: 'Expert' },
            { name: 'Tailwind', level: 85, type: 'Intermediate' }
        ]
    },
    {
        email: 'rohan.m@bits-pilani.ac.in',
        name: 'Rohan Mehta',
        university: 'BITS Pilani',
        role: 'ML Engineer',
        bio: 'Building LLM-powered applications and agents. Interested in Generative AI.',
        location: 'Pilani',
        lookingForTeam: true,
        skills: [
            { name: 'Python', level: 90, type: 'Expert' },
            { name: 'PyTorch', level: 80, type: 'Intermediate' },
            { name: 'LangChain', level: 85, type: 'Expert' }
        ]
    },
    {
        email: 'ananya.g@vit.ac.in',
        name: 'Ananya Gupta',
        university: 'VIT Vellore',
        role: 'Frontend Developer',
        bio: 'Frontend enthusiast. Specializing in animations, Framer Motion, and Next.js.',
        location: 'Vellore',
        lookingForTeam: true,
        skills: [
            { name: 'React', level: 90, type: 'Expert' },
            { name: 'JavaScript', level: 95, type: 'Expert' },
            { name: 'HTML5', level: 90, type: 'Expert' }
        ]
    },
    {
        email: 'aditya.k@nitt.edu',
        name: 'Aditya Kapoor',
        university: 'NIT Trichy',
        role: 'Backend Developer',
        bio: 'Database optimization and security. Express, PostgreSQL, and Redis.',
        location: 'Trichy',
        lookingForTeam: true,
        skills: [
            { name: 'Node.js', level: 85, type: 'Intermediate' },
            { name: 'SQL', level: 90, type: 'Expert' },
            { name: 'Docker', level: 75, type: 'Intermediate' }
        ]
    }
];

async function main() {
    const adminEmail = process.env.EMAIL_USER;
    const rawPassword = 'adminpassword123';

    if (!adminEmail) {
        console.error('No EMAIL_USER found in .env');
        return;
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for database seeding...');

    // 1. Seed Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    const admin = await Admin.findOneAndUpdate(
        { email: adminEmail },
        { email: adminEmail, password: hashedPassword },
        { upsert: true, new: true }
    );
    console.log(`✅ Admin user seeded successfully!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Master Password: ${rawPassword}`);

    // 2. Seed Hackathons (if not already seeded)
    const existingHackathonsCount = await Hackathon.countDocuments();
    if (existingHackathonsCount === 0) {
        await Hackathon.insertMany(defaultHackathons);
        console.log('✅ Seeded default hackathons.');
    } else {
        console.log(`ℹ️ Hackathons already exist (${existingHackathonsCount} records found). Skipping insert.`);
    }

    // 3. Seed Users
    const passwordHash = await bcrypt.hash('password123', salt);
    for (const mock of mockUsersData) {
        await User.findOneAndUpdate(
            { email: mock.email },
            { 
                ...mock, 
                password: passwordHash,
                authProvider: 'local'
            },
            { upsert: true, new: true }
        );
    }
    console.log('✅ Seeded 5 developer user accounts.');

    // 4. Seed Teams
    const hackathonsList = await Hackathon.find({});
    if (hackathonsList.length > 0) {
        await Team.deleteMany({});
        console.log('Cleared existing team records.');

        const aarav = await User.findOne({ email: 'aarav.s@iitd.ac.in' });
        const priya = await User.findOne({ email: 'priya.v@iitb.ac.in' });
        const rohan = await User.findOne({ email: 'rohan.m@bits-pilani.ac.in' });

        const team1 = await Team.create({
            name: 'Neural Knights',
            hackathonId: hackathonsList[0]._id,
            leaderId: aarav._id,
            members: [aarav._id, priya._id],
            pendingRequests: [],
            status: 'Active'
        });

        const team2 = await Team.create({
            name: 'Dev Force One',
            hackathonId: hackathonsList[1]._id,
            leaderId: rohan._id,
            members: [rohan._id],
            pendingRequests: [],
            status: 'Active'
        });

        console.log('✅ Seeded mock active teams successfully.');
        console.log(`   Team: "${team1.name}" for Hackathon: "${hackathonsList[0].title}"`);
        console.log(`   Team: "${team2.name}" for Hackathon: "${hackathonsList[1].title}"`);
    }

    console.log('🎉 Seeding successfully completed.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
