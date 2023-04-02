const asyncHandler = require("express-async-handler");
const ColorImage = require("../models/ColorImage");
const Color = require("../models/Color");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const colorImages = await ColorImage.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await ColorImage.find(query).sort(sort).countDocuments();

  // res.status(200).json({ colorImages: colorImages, count: count });
  res.status(200).json(colorImages);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          // { categoryName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const colorImages = await ColorImage.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await ColorImage.find(query).sort(sort).countDocuments();

  // res.status(200).json({ colorImages: colorImages, count: count });
  res.status(200).json(colorImages);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const colorImage = await ColorImage.findOne(query);

  res.status(200).json(colorImage);
});

const create = asyncHandler(async (req, res) => {
  const colorImage = new ColorImage({
    color: req.body.color,
    picture: req.body.picture,
  });

  const savedData = await colorImage.save();

  const color = Color.findById(req.body.color);
  await color.updateOne({
    $push: { images: { $each: [savedData._id], $position: 0 } },
  });

  res.status(200).json(await ColorImage.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const colorImage = await ColorImage.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (colorImage.picture !== req.body.picture) {
    await handleRemoveFile(colorImage.picture);
  }

  colorImage.color = req.body.color;
  colorImage.picture = req.body.picture;

  const savedData = await colorImage.save();
  res.status(200).json(await ColorImage.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const colorImage = await ColorImage.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  if (colorImage.picture) await handleRemoveFile(colorImage.picture);

  colorImage.active = -1;
  await Color.updateMany(
    { images: req.params.id },
    { $pull: { images: req.params.id } }
  );
  const savedData = await colorImage.save();
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
