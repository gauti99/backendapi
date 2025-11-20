const bcrypt = require('bcryptjs');
const { signToken } = require('../utils'); // make sure this file exports signToken
const Admin = require('../models/Admin');   // adjust path if needed

// Admin Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = signToken(admin._id, 'admin');

    // Send response (without password)
    res.status(201).json({
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = signToken(admin._id, 'admin');

    // Success response
    res.json({
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// Get Logged-in Admin Profile
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by your auth middleware
    res.json({
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};