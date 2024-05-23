const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const useRoutes = require("./routes/RootRoute");

const app = express();

const port = process.env.PORT || 5100;
connectDB();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
// app.use(cors())

app.use(cookieParser());
app.use(morgan("common"));

useRoutes(app);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at port ${port} ...`);
});
