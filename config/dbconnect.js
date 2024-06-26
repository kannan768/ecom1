const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbconnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Database connection error:", err));
};
module.exports = dbconnect;
