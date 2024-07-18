const express = require('express');
const router = express.Router();
const blogcategorycontroller=require('../controllers/blogcategorycontroller')

router.post('/createblogcategory',blogcategorycontroller.createBlogCategory)
router.get('/getallblogcategory', blogcategorycontroller.getAllBlogCategories);
router.get('/getbypblogcategoryid/:id', blogcategorycontroller.getBlogCategoryById);
router.put('/updateblogcategory/:id', blogcategorycontroller.updateBlogCategory);
router.delete('/deleteblogcategory/:id', blogcategorycontroller.deleteBlogCategory);
module.exports = router;