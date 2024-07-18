const express = require("express");
const router = express.Router();
const brandcontroller=require('../controllers/brandcontroller')
router.post('/createbrand',brandcontroller.createBrand);
router.get('/getallbrand',brandcontroller.getAllBrands);
router.get('/getbrandbyid/:id',brandcontroller.getBrandById);
router.put('/updatebyid/:id',brandcontroller.updateBrand)
router.delete('/deletebrand/:id',brandcontroller.deleteBrand)
module.exports = router;
