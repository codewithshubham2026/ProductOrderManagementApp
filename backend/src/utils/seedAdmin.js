const bcrypt = require('bcryptjs');
const User = require('../models/User');
const env = require('../config/env');

// Create default admin user on server start if it doesn't exist
async function seedAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: env.adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(env.adminPassword, 10);
    await User.create({
      name: env.adminName,
      email: env.adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Default admin user created');
    console.log(`   Email: ${env.adminEmail}`);
    console.log(`   Password: ${env.adminPassword}`);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
}

module.exports = seedAdmin;
