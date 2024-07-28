// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
router.post('/register', authController.register);
router.post('/login',authController.login)
router.get('/getalluser',authController.getAllUsers);
router.get('/getbyemail',authController.getUserByEmail)
router.delete("/deletebyemail", authController.deleteUserByEmail);
router.put('/updatebyemail', authController.updateUserByEmail);
router.put('/toggle-block', authController.toggleUserBlockByEmail);
router.post('/verifyotp',authController.verifyOtp)
router.post('/resetpassword',authController.resetPassword)
router.put('/updateaddress/:userid', authController.updateUserAddress);
router.post('/checkemail',authController.checkEmailExists);
router.post('/checkmobile',authController.checkMobileExists);
router.post('/resendotp',authController.resendOTP)
router.post('/setup-google-authenticator', authController.setupGoogleAuthenticator);
router.post('/verifygoogleotp',authController.verifygoogleotp);
router.post('/removeauth',authController.removeGoogleAuthenticator)
module.exports = router;
