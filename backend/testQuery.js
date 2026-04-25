const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const Hackathon = require('./src/models/Hackathon');
        const count = await Hackathon.countDocuments({});
        console.log(`Total Hackathons: ${count}`);

        const h = await Hackathon.find({});
        console.log(h.map(x => ({ mode: x.mode, domain: x.domain })));

        process.exit(0);
    });
