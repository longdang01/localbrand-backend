const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cors = require("cors");
var bodyParser = require("body-parser");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const useRoutes = require("./routes");
const port = process.env.PORT || 5000;

//connectDB
connectDB();

//
const app = express();

//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("common"));

//set routes
useRoutes(app);

//errorHandler
app.use(errorHandler);

//listen
app.listen(port, () => {
  console.log("Server is running...");
});
