require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/driverRoutes');
const errorHandler = require('./middlewares/errorHandler');


const app = express();
app.use(cors());
app.use(express.json());


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/monolithdb';
connectDB(MONGO_URI);


app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);


app.get('/', (req, res) => res.send('Monolith API running'));


app.use(errorHandler);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));