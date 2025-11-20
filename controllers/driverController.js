const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');


const signToken = (id) => jwt.sign({ id, type: 'driver' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });


exports.signup = async (req, res) => {
try {
const { name, email, password, phone } = req.body;
if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });


const exists = await Driver.findOne({ email });
if (exists) return res.status(400).json({ message: 'Driver already exists' });


const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);
const driver = await Driver.create({ name, email, password: hashed, phone });
const token = signToken(driver._id);


res.status(201).json({ driver: { id: driver._id, name: driver.name, email: driver.email }, token });
} catch (err) {
res.status(500).json({ message: 'Driver signup error', error: err.message });
}
};


exports.login = async (req, res) => {
try {
const { email, password } = req.body;
const driver = await Driver.findOne({ email });
if (!driver) return res.status(400).json({ message: 'Invalid credentials' });


const isMatch = await bcrypt.compare(password, driver.password);
if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


const token = signToken(driver._id);
res.json({ driver: { id: driver._id, name: driver.name, email: driver.email, isActive: driver.isActive }, token });
} catch (err) {
res.status(500).json({ message: 'Driver login error', error: err.message });
}
};


exports.getProfile = async (req, res) => {
res.json({ driver: req.user });
};


exports.updateProfile = async (req, res) => {
try {
const updates = (({ name, phone }) => ({ name, phone }))(req.body);
const driver = await Driver.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
res.json({ driver });
} catch (err) {
res.status(500).json({ message: 'Update profile error', error: err.message });
}
};