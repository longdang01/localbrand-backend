const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Cart = require("../models/Cart");
const Staff = require("../models/Staff");
const { ObjectId } = require("mongodb");
const { sendVerifyAccountMail } = require("../utils/Mail");
const { sendResetPassword } = require("../utils/Mail");

let refreshTokens = [];
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
    $or: [
      {
        $and: [
          {
            username: username,
          },
          { active: 1 },
        ],
      },
      {
        $and: [
          {
            email: email,
          },
          { active: 1 },
        ],
      },
    ],
  });

  if (userExists) {
    res.status(400);
    throw new Error("Tài khoản đã tồn tại");
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
    active: role == 5 ? -1 : 1,
  });

  let customer;
  if (role == 5) {
    const customerExists = await Customer.findOne({
      $and: [
        {
          phone: phone,
        },
        { active: 1 },
      ],
    });

    if (customerExists) {
      res.status(400);
      throw new Error("Tài khoản đã tồn tại");
    }

    // Create customer
    customer = await Customer.create({
      user: user._id,
      customerName,
      phone,
      address: address || "",
      picture: picture || "",
      dob: dob || "",
    });

    // Create cart
    cart = await Cart.create({
      customer: customer._id,
    });
  }

  let staff;
  if (role >= 1 && role <= 4) {
    const staffExists = await Staff.findOne({
      $and: [
        {
          phone: phone,
        },
        { active: 1 },
      ],
    });

    if (staffExists) {
      res.status(400);
      throw new Error("Tài khoản đã tồn tại");
    }
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

  const access_token = generateToken(user._id);

  if (user) {
    console.log("register", user);
    const dataSend = {
      // link: `${process.env.BASE_URL}/api/users/verify/${user._id}/${access_token}`,
      link: `${process.env.BASE_URL}/verify/${user._id}/${access_token}`,
    };
    await sendVerifyAccountMail(
      user.email,
      "[FRAGILE] Xác Minh Tài Khoản",
      dataSend
    );

    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        token: access_token,
      },
      customer: customer,
      staff: staff,
    });
  } else {
    res.status(400);
    throw new Error("Dữ liệu không hợp lệ");
  }
});

const verifyAccount = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.body.id });
  console.log(req.body);
  console.log(user);
  if (!user) {
    res.status(400);
    throw new Error("Đường dẫn không hợp lệ!");
  }

  const decoded = jwt.verify(req.body.token, process.env.CLIENT_JWT_SECRET);
  const token = await User.findById(decoded.id).select("-password");

  if (!token) {
    res.status(400);
    throw new Error("Đường dẫn không hợp lệ");
  }

  user.active = 1;
  await user.save();
  // await User.updateOne({ _id: user._id, active: 1 });
  res.send("Email verified successfully");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    $and: [{ email: req.body.email }, { active: 1 }],
  });
  if (!user) {
    res.status(400);
    throw new Error("Tài khoản chưa tồn tại");
  }

  const access_token = generateToken(user._id);

  const dataSend = {
    link: `${user.role != 5 ? process.env.ADMIN_URL : process.env.CLIENT_URL}/reset-password/${user._id}/${access_token}`,
  };

  await sendResetPassword(user.email, "Quên Mật Khẩu", dataSend);
  res.send("password reset link sent to your email account");
});

const resetPassword = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.params.id);
  // const user = await User.findById(req.body.id);
  if (!ObjectId.isValid(req.body.id)) {
    res.status(400);
    throw new Error("Đường dẫn không hợp lệ hoặc đã hết hạn!");
  }

  const user = await User.findOne({ _id: ObjectId(req.body.id) });

  if (!user) {
    res.status(400);
    throw new Error("Đường dẫn không hợp lệ hoặc đã hết hạn!");
  }
  // return res.status(400).send("Đường dẫn không hợp lệ hoặc đã hết hạn");
  const decoded = jwt.verify(req.body.token, process.env.CLIENT_JWT_SECRET);
  const token = await User.findById(decoded.id).select("-password");

  if (!token) return res.status(400).send("Đường dẫn không hợp lệ!");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  res.send("password reset sucessfully.");
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  // const { username, password, page } = req.body;
  const { page } = req.body;
  const { username, password } = req.body.user;

  // Check for user username
  const user = await User.findOne({
    $or: [
      { $and: [{ username: username }, { active: 1 }] },
      { $and: [{ email: username }, { active: 1 }] },
    ],
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const query = { $and: [{ user: ObjectId(user._id) }, { active: 1 }] };
    const customer = await Customer.findOne(query);
    const staff = await Staff.findOne(query);

    //page: 1=admin, 2=customer
    if (page == 1 && customer && user.role == 5) {
      res.status(400);
      throw new Error("Tài khoản không hợp lệ!");
    }

    if (page == 2 && staff && user.role != 5) {
      res.status(400);
      throw new Error("Tài khoản không hợp lệ!");
    }

    const refreshToken = generateRefreshToken(user._id);
    refreshTokens.push(refreshToken);
    // res.cookie("refresh_token", refreshToken, {
    //   // httpOnly: true,
    //   // secure: true,
    //   // sameSite: "Strict", // or 'Lax', it depends
    //   // maxAge: 604800000, // 7 days
    //   path: "/",
    //   sameSite: "strict",
    // });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: "false",
    });

    res.json({
      user: {
        _id: user.id,
        username: user.username,
        token: generateToken(user._id, user.role),
        refresh_token: refreshToken,
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

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    res.status(400);
    throw new Error("Not authorized!");
  }
  // If token does not exist, send error message
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403);
    throw new Error("Invalid refresh token!");
  }

  const user = await User.findById(
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET).id
  ).select("-password");
  if (!user) {
    res.status(403);
    throw new Error("Invalid refresh token!");
  }

  const newAccessToken = generateToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);
  refreshTokens.push(newRefreshToken);
  // res.cookie("refresh_token", newRefreshToken, {
  //   // httpOnly: true,
  //   // secure: true,
  //   // sameSite: "Strict", // or 'Lax', it depends
  //   // maxAge: 604800000, // 7 days
  //   path: "/",
  //   sameSite: "strict",
  // });

  res.cookie("refresh_token", newRefreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: "false",
  });
  res.status(200).json({ user: user, token: newAccessToken });
});

const changePassword = asyncHandler(async (req, res) => {
  // old password, new password
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  if (newPassword !== newPasswordConfirm) {
    res.status(400);
    throw new Error("Nhập lại mật khẩu mới không đúng");
  }

  // Check for user username
  const user = await User.findOne({
    $and: [{ username: req.user.username }, { active: 1 }],
  });

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    res.status(400);
    throw new Error("Mật khẩu cũ không đúng!");
  }

  if (await bcrypt.compare(newPassword, user.password)) {
    res.status(400);
    throw new Error("Mật khẩu cũ giống mật khẩu mới!");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  const savedData = await user.save();
  if (savedData) {
    res
      .status(201)
      .json({ message: "Đổi mật khẩu thành công, vui lòng đăng nhập lại!" });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const query = { user: ObjectId(req.user._id), active: 1 };
  // const staff = await Staff.findOne(query).populate("role");
  const customer = await Customer.findOne(query).populate("user");
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

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  refreshToken,
  verifyAccount,
  forgotPassword,
  resetPassword,
};
