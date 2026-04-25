const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Import models
const Hackathon = require('./src/models/Hackathon');
const User = require('./src/models/User');

const hackathons = [
    {
        title: "Global Game Jam",
        domain: "Game Development",
        mode: "ONLINE",
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        teamSize: 4,
        description: "Build the future of gaming. Solve real-world architectural problems using the latest engines.",
        image: "/assets/hackathons/global-game-jam.jpg"
    },
    {
        title: "Cyber Security Hackathon",
        domain: "Cybersecurity",
        mode: "HYBRID",
        deadline: new Date(Date.now() + 12 * 60 * 60 * 1000),
        teamSize: 3,
        description: "The ultimate CTF competition for university students. Secure the flag and win prizes.",
        image: "/assets/hackathons/cybersecurity-hack.jpg"
    },
    {
        title: "FinTech Innovation Hackathon",
        domain: "Financial Technology",
        mode: "OFFLINE",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        teamSize: 5,
        description: "Focus on UI/UX and frontend architecture. Create scalable design systems for fintech.",
        image: "/assets/hackathons/fintech-hack.jpg"
    },
    {
        title: "Health Hack",
        domain: "Healthcare",
        mode: "ONLINE",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        teamSize: 4,
        description: "Innovating for a sustainable future. Develop solutions for physical health and medicine tracking.",
        image: "/assets/hackathons/health-hack.jpg"
    },
    {
        title: "EdTech Innovation Hackathon",
        domain: "Education Technology",
        mode: "OFFLINE",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        teamSize: 4,
        description: "Contribute to major open source projects and earn rewards. A month-long learning event.",
        image: "/assets/hackathons/edtech-hack.jpg"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connection.dropDatabase();
        console.log('Database dropped.');

        await Hackathon.insertMany(hackathons);
        console.log('Hackathons seeded successfully.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            {
                name: "Aarav Sharma",
                email: "aarav.s@iitd.ac.in",
                password: hashedPassword,
                skills: ["React", "Python", "FastAPI"],
                bio: "Backend developer from IIT Delhi looking for challenging hackathons."
            },
            {
                name: "Priya Verma",
                email: "priya.v@iitb.ac.in",
                password: hashedPassword,
                skills: ["Figma", "Tailwind", "UI/UX"],
                bio: "Designer from IIT Bombay passionate about user experience."
            },
            {
                name: "Rohan Mehta",
                email: "rohan.m@bits-pilani.ac.in",
                password: hashedPassword,
                skills: ["TensorFlow", "PyTorch", "AWS"],
                bio: "Data Science student at BITS Pilani building cool ML models."
            },
            {
                name: "Ananya Gupta",
                email: "ananya.g@vit.ac.in",
                password: hashedPassword,
                skills: ["Node.js", "Express", "MongoDB"],
                bio: "Fullstack web developer from VIT Vellore."
            },
            {
                name: "Aditya Kapoor",
                email: "aditya.k@nitt.edu",
                password: hashedPassword,
                skills: ["Ethical Hacking", "Linux", "Python"],
                bio: "Cybersecurity enthusiast from NIT Trichy."
            }
        ];

        await User.insertMany(users);
        console.log('Users seeded successfully.');

        console.log('Seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
