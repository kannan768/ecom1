const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig')
const productcontroller=require('../controllers/productcontroller')
router.get('/getallproduct',productcontroller.getAllProducts)
router.get("/getbyproductid/:id", productcontroller.getProductById);
router.put("/updateproduct/:id",productcontroller.updateProductById)
router.delete("/deleteproduct/:id",productcontroller.deleteProductById)
router.post('/addwhitelist/:productid/:userid', productcontroller.addorremovewhitelist);
router.post('/addrating/:productid/:userid', productcontroller.addRating);
router.post('/createproduct',productcontroller.createProduct);
router.post('/images/:productid', upload.array('images', 10), productcontroller.uploadProductImages);
router.get('/getwishlist/:userid', productcontroller.getAllWishlistProducts);
router.get('/getproductbybrand',productcontroller.getProductsByBrand);
router.get('/getproductbystar',productcontroller.getProductsByStarRating);
router.get('/getdiscount/:start/:end', productcontroller.getProductsByDiscountRange);
router.get('/getnewarrival',productcontroller.getlatestarrival)
module.exports = router;