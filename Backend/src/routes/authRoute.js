const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth.Middleware');
const {multerMiddleware} = require('../db/cloudinary.db');


const router  = express.Router();


router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.get('/logout', authController.logout)


//protected route
router.put('/update-profile' ,authMiddleware , authController.updateProfile)
router.get('/check-auth', authMiddleware, authController.checkAuthenticated)
router.get('/users' , authMiddleware, authController.getAllUsers)

module.exports = router;