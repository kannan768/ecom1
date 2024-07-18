const express = require("express");
const router = express.Router();
const ordercontroller=require('../controllers/ordercontroller')
router.post('/createorder/:userid',ordercontroller.createOrder)
router.get('/getallorders',ordercontroller.getAllOrders);
router.get('/getordersbyid/:orderId',ordercontroller.getOrderById);
router.post('/createdirectorder/:userId',ordercontroller.createDirectOrder)
module.exports=router;