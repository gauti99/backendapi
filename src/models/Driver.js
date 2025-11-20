const mongoose = require('mongoose');


const DriverSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true },
phone: { type: String },
isActive: { type: Boolean, default: true },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Driver', DriverSchema);