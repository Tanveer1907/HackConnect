require("dns").setDefaultResultOrder("ipv4first");
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
    console.log(`Server running`);
});
