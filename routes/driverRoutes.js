const express = require('express');
const { signup, login, getProfile, updateProfile } = require('../controllers/driverController');
const { verifyToken } = require('../middlewares/auth');


const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);


router.get('/me', verifyToken('driver'), getProfile);
router.patch('/me', verifyToken('driver'), updateProfile);


module.exports = router;