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

const authRoutes = require("./routes/authRoutes");

app.use("/api/user", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
