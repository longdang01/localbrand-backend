const asyncHandler = require("express-async-handler");
const Lookbook = require("../models/Lookbook");
const Collection = require("../models/Collection");
const LookbookImage = require("../models/LookbookImage");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const lookbooks = await Lookbook.find(query)
    .sort(sort)
    .populate("lookbookImages")
    .populate("collectionInfo");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Lookbook.find(query).sort(sort).countDocuments();

  // res.status(200).json({ lookbooks: lookbooks, count: count });
  res.status(200).json(lookbooks);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);
  const pageIndex = Number(req.body.pageIndex) || 1;
  const pageSize = Number(req.body.pageSize) || 10;

  const skip = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const query = req.body.searchData
    ? {
        $and: [
          { lookbookName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  // const lookbooks = await Lookbook.find(query)
  //   .sort(sort)
  //   .populate("lookbookImages")
  //   .populate("collectionInfo");

  const collections = await Collection.find({active: 1}).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Lookbook.find(query).sort(sort).countDocuments();

  // res.status(200).json({ lookbooks: lookbooks, collections: collections });
  const [lookbooks, total] = await Promise.all([
    Lookbook.find(query).sort(sort).skip(skip).limit(limit),
    Lookbook.countDocuments(query),
  ]);

  res.status(200).json({ lookbooks: lookbooks, collections: collections, total });
  // res.status(200).json(lookbooks);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const lookbook = await Lookbook.findOne(query)
    .populate("lookbookImages")
    .populate("collectionInfo");

  res.status(200).json(lookbook);
});

const create = asyncHandler(async (req, res) => {
  const lookbook = new Lookbook({
    lookbookName: req.body.lookbookName,
    collectionInfo: req.body.collectionInfo,
    description: req.body.description || "",
  });

  const savedData = await lookbook.save();

  res
    .status(200)
    .json(
      await Lookbook.findById(savedData._id)
        .populate("lookbookImages")
        .populate("collectionInfo")
    );
});

const update = asyncHandler(async (req, res) => {
  const lookbook = await Lookbook.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  lookbook.lookbookName = req.body.lookbookName;
  lookbook.collectionInfo = req.body.collectionInfo;
  lookbook.description = req.body.description;

  const savedData = await lookbook.save();
  res
    .status(200)
    .json(
      await Lookbook.findById(savedData._id)
        .populate("lookbookImages")
        .populate("collectionInfo")
    );
});

const remove = asyncHandler(async (req, res) => {
  const lookbook = await Lookbook.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  })
    .populate("lookbookImages")
    .populate("collectionInfo");

  lookbook.active = -1;
  const savedData = await lookbook.save();

  // subCategory

  // await LookbookImage.updateMany({ lookbook: req.params.id }, { lookbook: null });
  await LookbookImage.updateMany({ lookbook: req.params.id }, { active: -1 });
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
