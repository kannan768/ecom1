const express = require("express");
const router = express.Router();
const blogcontroller = require("../controllers/blogcontroller");
const upload = require('../config/multerConfig')
router.post("/createblog", blogcontroller.createBlog);
router.get('/:id',blogcontroller.getBlogById)
router.get('/all/getallblogs',blogcontroller.getAllBlogs)
router.put('/updateblog/:id',blogcontroller.updateBlog);
router.delete('/deleteblog/:id',blogcontroller.deleteBlog)
router.post('/like/:blogid/:usreid',blogcontroller.likeblog)
router.post('/dislike/:blogid/:usreid',blogcontroller.dislike)
router.post('/images/:id', upload.array('images', 10), blogcontroller.uploadblogImages);
module.exports = router;
