const express = require("express");
const router = express.Router();
const couponcontroller=require('../controllers/couponcontroller');
router.post('/createcoupon',couponcontroller.createCoupon)
router.get('/getallcoupons',couponcontroller.getAllCoupons);
router.get('/:id',couponcontroller.getCouponById);
router.put('/updatecoupon/:id',couponcontroller.updateCouponById);
router.delete('/deletecoupon/:id',couponcontroller.deleteCouponById);
module.exports=router;