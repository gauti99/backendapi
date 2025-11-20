require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 🔥 FIXED PATH: server.js is inside /src so go one level up for config
const connectDB = require('../src/config/db.js');

// 🔥 FIXED PATH: routes are inside /src/routes
const adminRoutes = require('./routes/adminRoutes.js');
const driverRoutes = require('./routes/driverRoutes.js');

// 🔥 FIXED PATH: middleware inside /src/middlewares


const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/monolithdb';
connectDB(MONGO_URI);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);

app.get('/', (req, res) => res.send('Monolith API running'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
