const asyncHandler = require("express-async-handler");
const Role = require("../models/Role");
const { ObjectId } = require("mongodb");

// @desc    GET roles
// @route   GET /api/roles/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const roles = await Role.find(query);

  res.status(200).json(roles);
});

// @desc    POST roles
// @route   POST /api/roles/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const roles = await Role.find(query);

  res.status(200).json(roles);
});

// @desc    Get roles
// @route   GET /api/roles/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const role = await Role.findById(query);

  res.status(200).json(role);
});

// @desc    POST roles
// @route   POST /api/roles
// @access  Private
const create = asyncHandler(async (req, res) => {
  const role = new Role({
    roleName: req.body.roleName,
    description: req.body.description,
  });

  const savedData = await role.save();
  res.status(200).json(savedData);
});

// @desc    PUT roles
// @route   PUT /api/roles/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  role.roleName = req.body.roleName;
  role.description = req.body.description;

  const savedData = await role.save();
  res.status(200).json(savedData);
});

// @desc    DELETE roles
// @route   DELETE /api/roles/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  role.isActive = -1;

  const savedData = await role.save();
  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getById,
  create,
  update,
  remove,
};
