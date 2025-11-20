const bcrypt = require("bcryptjs");
const { signToken } = require("../utils"); // make sure this file exports signToken
const Admin = require("../models/Admin"); // adjust path if needed

// Admin Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
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
    const token = signToken(admin._id, "admin");

    // Send response (without password)
    res.status(201).json({
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = signToken(admin._id, "admin");

    // Success response
    res.json({
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
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
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Get Profile - Already have? Keep this updated version
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select("-password");
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile (name & email)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const admin = await Admin.findById(req.user._id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Check if email is already taken by someone else
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both passwords" });
    }

    const admin = await Admin.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
