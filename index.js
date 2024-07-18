const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const dbconnect = require("./config/dbconnect");
//const morgan=require('morgan')
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//app.use(morgan());

app.use(bodyParser.json());
app.use(cors());

dbconnect();
const productroutes = require("./routes/productroutes");
const authRoutes = require("./routes/authRoutes");
const blogroutes = require("./routes/blogroutes");
const brandroutes=require('./routes/brandroutes')
const productcategory=require('./routes/productcategoryroutes')
const blogcategory=require('./routes/blogcategoryroutes')
const coupon=require('./routes/couponroutes')
const cart=require('./routes/cartroutes')
const order=require('./routes/orderroutes')
app.use("/api/user", authRoutes);
app.use("/api/product", productroutes);
app.use("/api/blog", blogroutes);
app.use('/api/brand',brandroutes)
app.use('/api/pcategory',productcategory)
app.use('/api/blogcategory',blogcategory)
app.use('/api/coupon',coupon)
app.use('/api/cart',cart)
app.use('/api/order',order)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
