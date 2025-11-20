const express = require('express');
const { signup, login, getProfile, addDriver, listDrivers, setDriverActive } = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/auth');


const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);


router.get('/me', verifyToken('admin'), getProfile);


router.post('/drivers', verifyToken('admin'), addDriver);
router.get('/drivers', verifyToken('admin'), listDrivers);
router.patch('/drivers/:id/active', verifyToken('admin'), setDriverActive);


module.exports = router;