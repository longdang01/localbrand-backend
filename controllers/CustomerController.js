const asyncHandler = require("express-async-handler");
const Customer = require("../models/Customer");
const User = require("../models/User");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const customers = await Customer.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Customer.find(query).sort(sort).countDocuments();

  // res.status(200).json({ customers: customers, count: count });
  res.status(200).json(customers);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          { customerName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const customers = await Customer.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Customer.find(query).sort(sort).countDocuments();

  // res.status(200).json({ customers: customers, count: count });
  res.status(200).json(customers);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const customer = await Customer.findOne(query).populate("user");

  res.status(200).json(customer);
});

const create = asyncHandler(async (req, res) => {
  const customer = new Customer({
    user: req.body.user,
    customerName: req.body.customerName,
    picture: req.body.picture || "",
    dob: req.body.dob || "",
    address: req.body.address || "",
    phone: req.body.phone,
  });

  const savedData = await customer.save();

  res.status(200).json(await Customer.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  customer.user = req.body.user;
  customer.customerName = req.body.customerName;
  customer.picture = req.body.picture;
  customer.dob = req.body.dob;
  customer.address = req.body.address;
  customer.phone = req.body.phone;

  const savedData = await customer.save();
  res.status(200).json(await Customer.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  customer.active = -1;
  const savedData = await customer.save();

  // subCategory
  // await SubCategory.updateMany({ customer: req.params.id }, { customer: null });
  await User.updateMany({ _id: savedData.user }, { active: -1 });
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
