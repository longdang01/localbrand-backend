const asyncHandler = require("express-async-handler");
const Staff = require("../models/Staff");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const staffs = await Staff.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Staff.find(query).sort(sort).countDocuments();

  // res.status(200).json({ staffs: staffs, count: count });
  res.status(200).json(staffs);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);
  const pageIndex = Number(req.body.pageIndex) || 1;
  const pageSize = Number(req.body.pageSize) || 10;

  const skip = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const query = req.body.searchData
    ? {
        $and: [
          { staffName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  // const staffs = await Staff.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Staff.find(query).sort(sort).countDocuments();

  // res.status(200).json({ staffs: staffs, count: count });
  // res.status(200).json(staffs);
  const [staffs, total] = await Promise.all([
    Staff.find(query).sort(sort).skip(skip).limit(limit),
    Staff.countDocuments(query),
  ]);
  res.status(200).json({ staffs, total });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const staff = await Staff.findOne(query).populate("user");

  res.status(200).json(staff);
});

const create = asyncHandler(async (req, res) => {
  const staff = new Staff({
    user: req.body.user,
    staffName: req.body.staffName,
    picture: req.body.picture || "",
    dob: req.body.dob || "",
    address: req.body.address || "",
    phone: req.body.phone,
  });

  const savedData = await staff.save();

  res.status(200).json(await Staff.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const staff = await Staff.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  const user = await User.findOne({
    $and: [{ active: 1 }, { username: req.body.username }],
  });


  // remove image
  if (staff.picture !== req.body.picture) {
    await handleRemoveFile(staff.picture);
  }

  staff.user = req.body.user;
  staff.staffName = req.body.staffName;
  staff.picture = req.body.picture;
  staff.dob = req.body.dob;
  staff.address = req.body.address;
  staff.phone = req.body.phone;

  user.email = req.body.email;
  user.role = req.body.role;
  await user.save();

  const savedData = await staff.save();
  res.status(200).json(await Staff.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const staff = await Staff.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  if (staff.picture) await handleRemoveFile(staff.picture);

  staff.active = -1;
  const savedData = await staff.save();

  // subCategory
  // await SubCategory.updateMany({ staff: req.params.id }, { staff: null });
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
