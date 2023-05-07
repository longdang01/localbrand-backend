const asyncHandler = require("express-async-handler");
const Collection = require("../models/Collection");
const Lookbook = require("../models/Lookbook");
const CollectionImage = require("../models/CollectionImage");
// const LookBook = require("../models/LookBook");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const collections = await Collection.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Collection.find(query).sort(sort).countDocuments();

  // res.status(200).json({ collections: collections, count: count });
  res.status(200).json(collections);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          { collectionName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const collections = await Collection.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Collection.find(query).sort(sort).countDocuments();

  // res.status(200).json({ collections: collections, count: count });
  res.status(200).json(collections);
});

const getByPath = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }],
  };
  const sort = { createdAt: -1 };

  const lookbooks = await Lookbook.find(query)
    .sort(sort)
    .populate("lookbookImages")
    .populate("collectionInfo");
  const result = lookbooks.filter((look) => {
    console.log(look.collectionInfo.path);
    console.log(req.body.path);
    console.log(look.collectionInfo.path == req.body.path);

    return look.collectionInfo.path == req.body.path;
  });
  console.log(req.body.path);
  console.log(result);

  res.status(200).json(result);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const collection = await Collection.findOne(query).populate(
    "collectionImages"
  );

  res.status(200).json(collection);
});

const create = asyncHandler(async (req, res) => {
  const collection = new Collection({
    collectionName: req.body.collectionName,
    path: req.body.path,
    releaseDate: req.body.releaseDate || "",
    description: req.body.description || "",
  });

  // Check if Collection exists
  const collectionExists = await Collection.findOne({
    path: req.body.path,
    active: 1,
  });

  // const collectionExists = await Collection.findOne({
  //   $and: [{ path: req.body.path }, { active: 1 }],
  // });

  if (collectionExists) {
    res.status(400);
    throw new Error("Path đã tồn tại");
  }

  const savedData = await collection.save();

  res
    .status(200)
    .json(
      await Collection.findById(savedData._id).populate("collectionImages")
    );
});

const update = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  collection.collectionName = req.body.collectionName;
  collection.path = req.body.path;
  collection.releaseDate = req.body.releaseDate;
  collection.description = req.body.description;

  if (collection.path != req.body.path) {
    // Check if Collection exists
    const collectionExists = await Collection.findOne({
      path: req.body.path,
      active: 1,
    });

    if (collectionExists) {
      res.status(400);
      throw new Error("Path already exists");
    }
  }

  const savedData = await collection.save();
  res
    .status(200)
    .json(
      await Collection.findById(savedData._id).populate("collectionImages")
    );
});

const remove = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  }).populate("collectionImages");

  collection.active = -1;
  const savedData = await collection.save();

  // lookbook?
  await Lookbook.updateMany({ collectionInfo: req.params.id }, { active: -1 });

  // await CollectionImage.updateMany({ collection: req.params.id }, { collection: null });
  await CollectionImage.updateMany(
    { collection: req.params.id },
    { active: -1 }
  );
  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getById,
  getByPath,
  create,
  update,
  remove,
};
