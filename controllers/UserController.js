const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Staff = require("../models/Staff");
const { ObjectId } = require("mongodb");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const register = asyncHandler(async (req, res) => {
  const {
    username,
    password,
    email,
    role,
    customerName,
    staffName,
    phone,
    address,
    picture,
    dob,
  } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({
    $and: [
      {
        username: username,
      },
      { active: 1 },
    ],
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    role: Number(role),
  });

  let customer;
  if (role == 5) {
    // Create customer
    customer = await Customer.create({
      user: user._id,
      customerName,
      phone,
      address,
      picture: picture || "",
      dob: dob || "",
    });
  }

  let staff;
  if (role >= 1 && role <= 4) {
    // Create staff
    staff = await Staff.create({
      user: user._id,
      staffName,
      phone,
      address,
      picture: picture || "",
      dob: dob || "",
    });
  }

  if (user) {
    res.status(201).json({
      user: {
        _id: user.id,
        username: user.username,
        token: generateToken(user._id),
      },
      customer: customer,
      staff: staff,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check for user username
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const query = { user: ObjectId(user._id), active: 1 };
    const customer = await Customer.findOne(query);
    const staff = await Staff.findOne(query);

    res.json({
      user: {
        _id: user.id,
        username: user.username,
        token: generateToken(user._id, user.role),
        role: user.role,
      },
      customer: customer,
      staff: staff,
    });
  } else {
    res.status(400);
    throw new Error("Thông tin không hợp lệ!");
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const query = { user: ObjectId(req.user._id), active: 1 };
  // const staff = await Staff.findOne(query).populate("role");
  const customer = await Customer.findOne(query);
  const staff = await Staff.findOne(query);
  res.status(200).json({ user: req.user, staff: staff, customer: customer });

  // res.status(200).json(staff);
});

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id },
    role == 1
      ? process.env.ADMIN_JWT_SECRET
      : role == 2
      ? process.env.IMPORT_JWT_SECRET
      : role == 3
      ? process.env.SALES_JWT_SECRET
      : role == 4
      ? process.env.MEDIA_JWT_SECRET
      : process.env.CLIENT_JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = {
  register,
  login,
  getMe,
};
