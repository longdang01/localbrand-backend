const asyncHandler = require("express-async-handler");
const Size = require("../models/Size");
const { ObjectId } = require("mongodb");
const Color = require("../models/Color");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const sizes = await Size.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Size.find(query).sort(sort).countDocuments();

  // res.status(200).json({ sizes: sizes, count: count });
  res.status(200).json(sizes);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          { sizeName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const sizes = await Size.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Size.find(query).sort(sort).countDocuments();

  // res.status(200).json({ sizes: sizes, count: count });
  res.status(200).json(sizes);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const size = await Size.findOne(query);

  res.status(200).json(size);
});

const create = asyncHandler(async (req, res) => {
  const size = new Size({
    color: req.body.color,
    sizeName: req.body.sizeName,
    quantity: req.body.quantity,
  });

  const savedData = await size.save();
  const color = await Color.findById(req.body.color);
  await color.updateOne({ $push: { sizes: savedData._id } });

  res.status(200).json(await Size.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const size = await Size.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  size.color = req.body.color;
  size.sizeName = req.body.sizeName;
  size.quantity = req.body.quantity;

  const savedData = await size.save();
  res.status(200).json(await Size.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const size = await Size.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  size.active = -1;
  await Color.updateMany(
    { sizes: req.params.id },
    { $pull: { sizes: req.params.id } }
  );

  const savedData = await size.save();

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
