const asyncHandler = require("express-async-handler");
const CollectionImage = require("../models/CollectionImage");
const { ObjectId } = require("mongodb");
const Collection = require("../models/Collection");

// @desc    GET collectionImages
// @route   GET /api/collectionImages/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const collectionImages = await CollectionImage.find(query).sort(sort);

  res.status(200).json(collectionImages);
});

// @desc    POST collectionImages
// @route   POST /api/collectionImages/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const collectionImages = await CollectionImage.find(query).sort(sort);

  res.status(200).json(collectionImages);
});

// @desc    Get collectionImages
// @route   GET /api/collectionImages/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const collectionImage = await CollectionImage.findById(query);

  res.status(200).json(collectionImage);
});

// @desc    POST collectionImages
// @route   POST /api/collectionImages
// @access  Private
const create = asyncHandler(async (req, res) => {
  const collectionImage = new CollectionImage({
    collectionInfo: req.body.collectionInfo,
    picture: req.body.picture,
  });

  const savedData = await collectionImage.save();
  const collection = Collection.findById(req.body.collectionInfo);
  await collection.updateOne({
    $push: { images: { $each: [savedData._id], $position: 0 } },
  });

  res.status(200).json(savedData);
});

// @desc    PUT collectionImages
// @route   PUT /api/collectionImages/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const collectionImage = await CollectionImage.findById(req.params.id);
  collectionImage.collectionInfo = req.body.collectionInfo;
  collectionImage.picture = req.body.picture;

  const savedData = await collectionImage.save();
  res.status(200).json(savedData);
});

// @desc    DELETE collectionImages
// @route   DELETE /api/collectionImages/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const collectionImage = await CollectionImage.findById(req.params.id);
  collectionImage.isActive = -1;

  await Collection.updateMany(
    { images: req.params.id },
    { $pull: { images: req.params.id } }
  );
  // const collection = Collection.findById(collectionImage.collectionInfo);
  // await collection.updateOne({ $pull: { images: req.params.id } });
  const savedData = await collectionImage.save();
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
