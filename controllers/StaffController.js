const asyncHandler = require("express-async-handler");
const Staff = require("../models/Staff");
const Role = require("../models/Role");
const { ObjectId } = require("mongodb");

// @desc    GET staffs
// @route   GET /api/staffs/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const staffs = await Staff.find(query).populate("user").populate("role");
  const roles = await Role.find(query);

  res.status(200).json({
    staffs: staffs,
    roles: roles,
  });
});

// @desc    POST staffs
// @route   POST /api/staffs/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const staffs = await Staff.find(query).populate("user").populate("role");
  const roles = await Role.find(query);

  res.status(200).json({
    staffs: staffs,
    roles: roles,
  });
});

// @desc    Get staffs
// @route   GET /api/staffs/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const staff = await Staff.findById(query).populate("user").populate("role");

  res.status(200).json(staff);
});

// @desc    POST staffs
// @route   POST /api/staffs
// @access  Private
const create = asyncHandler(async (req, res) => {
  const staff = new Staff({
    user: req.body.user,
    role: req.body.role,
    staffName: req.body.staffName,
    picture: req.body.picture,
    dob: req.body.dob,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
  });

  const savedData = await staff.save();
  res
    .status(200)
    .json(
      await Staff.findById(savedData._id).populate("user").populate("role")
    );
});

// @desc    PUT staffs
// @route   PUT /api/staffs/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  staff.user = req.body.user;
  staff.role = req.body.role;
  staff.staffName = req.body.staffName;
  staff.picture = req.body.picture;
  staff.dob = req.body.dob;
  staff.address = req.body.address;
  staff.phone = req.body.phone;
  staff.email = req.body.email;

  const savedData = await staff.save();
  res
    .status(200)
    .json(
      await Staff.findById(savedData._id).populate("user").populate("role")
    );
});

// @desc    DELETE staffs
// @route   DELETE /api/staffs/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  staff.isActive = -1;

  const savedData = await staff.save();
  res
    .status(200)
    .json(
      await Staff.findById(savedData._id).populate("user").populate("role")
    );
});

module.exports = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};
