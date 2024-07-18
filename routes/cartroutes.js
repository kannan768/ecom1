const express = require('express');
const router = express.Router();
const cartcontroller = require('../controllers/cartcontroller');
router.post('/addtocart/:userid', cartcontroller.addToCart);
router.get('/getcart/:userid',cartcontroller.getCart)
router.get('/getallcart',cartcontroller.getAllCart)
router.delete('/deletecart/:userid', cartcontroller.deleteProductFromCart);
router.put('/updatecart/:userid',cartcontroller.updateCart);
router.post('/couponcart/:userid', cartcontroller.applyCoupon);
module.exports = router;