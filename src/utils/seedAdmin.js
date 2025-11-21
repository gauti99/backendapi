require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/monolithdb';
    await connectDB(uri);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    if (!adminEmail || !adminPassword) {
      console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
      process.exit(1);
    }

    const existing = await Admin.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin already exists:', adminEmail);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminPassword, salt);

    const admin = new Admin({ name: adminName, email: adminEmail, password: hashed });
    await admin.save();
    console.log('Seeded admin:', adminEmail);
    process.exit(0);
  } catch (err) {
    console.error('Seeding admin failed', err);
    process.exit(1);
  }
}

seed();
