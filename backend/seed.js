const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin');

async function main() {
  const email = process.env.EMAIL_USER;
  const rawPassword = 'adminpassword123';

  if (!email) {
    console.error('No EMAIL_USER found in .env');
    return;
  }

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  // Upsert admin user in MongoDB
  const admin = await Admin.findOneAndUpdate(
    { email },
    { email, password: hashedPassword },
    { upsert: true, new: true }
  );

  console.log(`✅ Admin user seeded successfully in MongoDB!`);
  console.log(`Admin Email: ${admin.email}`);
  console.log(`Master Password: ${rawPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
