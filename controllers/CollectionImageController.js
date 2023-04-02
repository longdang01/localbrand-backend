const asyncHandler = require("express-async-handler");
const Collection = require("../models/Collection");
const CollectionImage = require("../models/CollectionImage");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  const collectionImages = await CollectionImage.find(query).sort(sort);

  res.status(200).json(collectionImages);
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

  const collectionImages = await CollectionImage.find(query).sort(sort);

  const collections = await Collection.find(query)
    .sort(sort)
    .populate("collectionImages");
  res
    .status(200)
    .json({ collectionImages: collectionImages, collections: collections });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const collectionImage = await CollectionImage.findOne(query);
  res.status(200).json(collectionImage);
});

const create = asyncHandler(async (req, res) => {
  const collectionImage = new CollectionImage({
    collectionInfo: req.body.collectionInfo,
    picture: req.body.picture || "",
  });

  const savedData = await collectionImage.save();

  // push item to collectionImages in collection schema
  const collection = await Collection.findById(req.body.collectionInfo);
  // await collection.updateOne({ $push: { collectionImages: savedData._id } });
  await collection.updateOne({
    $push: { collectionImages: { $each: [savedData._id], $position: 0 } },
  });

  // savedData.collection = collection;

  res.status(200).json(await CollectionImage.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const collectionImage = await CollectionImage.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (collectionImage.picture !== req.body.picture) {
    await handleRemoveFile(collectionImage.picture);
  }

  collectionImage.collectionInfo = req.body.collectionInfo;
  collectionImage.picture = req.body.picture;

  const savedData = await collectionImage.save();

  res.status(200).json(await CollectionImage.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const collectionImage = await CollectionImage.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });
  if (collectionImage.picture) await handleRemoveFile(collectionImage.picture);

  collectionImage.active = -1;

  const savedData = await collectionImage.save();

  await Collection.updateMany(
    { collectionImages: req.params.id },
    { $pull: { collectionImages: req.params.id } }
  );

  // await Post.updateMany({ collectionImage: req.params.id }, { active: -1 });

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
