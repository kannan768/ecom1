const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productcategorycontroller'); // Adjust the path accordingly

router.post('/createpcategory', productCategoryController.createProductCategory);
router.get('/getallpcategory', productCategoryController.getAllProductCategories);
router.get('/getbypcategoryid/:id', productCategoryController.getProductCategoryById);
router.put('/updatepcategory/:id', productCategoryController.updateProductCategory);
router.delete('/deletepcategory/:id', productCategoryController.deleteProductCategory);

module.exports = router;
