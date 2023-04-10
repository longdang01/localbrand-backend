const asyncHandler = require("express-async-handler");
const Lookbook = require("../models/Lookbook");
const LookbookImage = require("../models/LookbookImage");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  const lookbookImages = await LookbookImage.find(query).sort(sort);

  res.status(200).json(lookbookImages);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };

  const query = req.body.searchData
    ? {
        $and: [
          // { subCategoryName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const lookbookImages = await LookbookImage.find(query).sort(sort);

  const lookbooks = await Lookbook.find(query)
    .sort(sort)
    .populate("lookbookImages");
  res
    .status(200)
    .json({ lookbookImages: lookbookImages, lookbooks: lookbooks });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const lookbookImage = await LookbookImage.findOne(query);
  res.status(200).json(lookbookImage);
});

const create = asyncHandler(async (req, res) => {
  const lookbookImage = new LookbookImage({
    lookbook: req.body.lookbook,
    picture: req.body.picture || "",
  });

  const savedData = await lookbookImage.save();

  // push item to lookbookImages in lookbook schema
  const lookbook = await Lookbook.findById(req.body.lookbook);
  // await lookbook.updateOne({ $push: { lookbookImages: savedData._id } });
  await lookbook.updateOne({
    $push: { lookbookImages: { $each: [savedData._id], $position: 0 } },
  });

  // savedData.lookbook = lookbook;

  res.status(200).json(await LookbookImage.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const lookbookImage = await LookbookImage.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (lookbookImage.picture !== req.body.picture) {
    await handleRemoveFile(lookbookImage.picture);
  }

  lookbookImage.lookbook = req.body.lookbook;
  lookbookImage.picture = req.body.picture;

  const savedData = await lookbookImage.save();

  res.status(200).json(await LookbookImage.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const lookbookImage = await LookbookImage.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });
  if (lookbookImage.picture) await handleRemoveFile(lookbookImage.picture);

  lookbookImage.active = -1;

  const savedData = await lookbookImage.save();

  await Lookbook.updateMany(
    { lookbookImages: req.params.id },
    { $pull: { lookbookImages: req.params.id } }
  );

  // await Post.updateMany({ lookbookImage: req.params.id }, { active: -1 });

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
