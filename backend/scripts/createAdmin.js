require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'admin@kevinsgym.com' });
  if (existing) {
    console.log('Admin account already exists.');
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name: 'Admin',
    email: 'admin@kevinsgym.com',
    password: 'abcd24680',
    role: 'admin',
  });

  console.log('Admin account created successfully.');
  await mongoose.disconnect();
})();
