const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded =
        req.headers.role == "1"
          ? jwt.verify(token, process.env.ADMIN_JWT_SECRET)
          : req.headers.role == "2"
          ? jwt.verify(token, process.env.IMPORT_JWT_SECRET)
          : req.headers.role == "3"
          ? jwt.verify(token, process.env.SALES_JWT_SECRET)
          : req.headers.role == "4"
          ? jwt.verify(token, process.env.MEDIA_JWT_SECRET)
          : null;

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  if (req.headers.role == "1") {
    next();
  } else {
    res.status(401);
    throw new Error("Access denied, you must an admin");
  }
});

const protectClient = asyncHandler(async (req, res, next) => {
  if (req.headers.role == "5") {
    next();
  } else {
    res.status(401);
    throw new Error("Access denied, you must an customer");
  }
});

const protectImport = asyncHandler(async (req, res, next) => {
  if (req.headers.role == "1" || req.headers.role == "2") {
    next();
  } else {
    res.status(401);
    throw new Error("Access denied, you must an admin or import staff");
  }
});

const protectSales = asyncHandler(async (req, res, next) => {
  if (req.headers.role == "1" || req.headers.role == "3") {
    next();
  } else {
    res.status(401);
    throw new Error("Access denied, you must an admin or sales staff");
  }
});

const protectMedia = asyncHandler(async (req, res, next) => {
  if (req.headers.role == "1" || req.headers.role == "4") {
    next();
  } else {
    res.status(401);
    throw new Error("Access denied, you must an admin or media staff");
  }
});

module.exports = {
  protect,
  protectAdmin,
  protectClient,
  protectImport,
  protectSales,
  protectMedia,
};
