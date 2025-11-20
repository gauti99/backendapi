const mongoose = require('mongoose');


const AdminSchema = new mongoose.Schema({
name: { type: String, required: true, default: 'Admin' },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true },
role: { type: String, default: 'admin' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Admin', AdminSchema);