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
const productcontroller=require('../controllers/productcontroller')
router.post('/createproduct',productcontroller.createProduct)
router.get('/getallproduct',productcontroller.getAllProducts)
router.get("/getbyproductid/:id", productcontroller.getProductById);
router.put("/updateproduct/:id",productcontroller.updateProductById)
router.delete("/deleteproduct/:id",productcontroller.deleteProductById)

module.exports = router;
