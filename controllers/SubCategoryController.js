const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
// const Post = require("../models/post");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  const subCategories = await SubCategory.find(query).sort(sort);

  res.status(200).json(subCategories);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  const pageIndex = Number(req.body.pageIndex) || 1;
  const pageSize = Number(req.body.pageSize) || 10;

  const skip = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  
  const query = req.body.searchData
    ? {
        $and: [
          { subCategoryName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  // const subCategories = await SubCategory.find(query)
  //   .sort(sort)
  //   .populate("category");

  const [subCategories, total] = await Promise.all([
    SubCategory.find(query).sort(sort).skip(skip).limit(limit),
    SubCategory.countDocuments(query),
  ]);

  const categories = await Category.find({active: 1})
    .sort(sort)
    .populate("subCategories");
  res
    .status(200)
    .json({ subCategories: subCategories, categories: categories, total});
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const subCategory = await SubCategory.findOne(query).populate("category");
  res.status(200).json(subCategory);
});

const create = asyncHandler(async (req, res) => {
  const subCategory = new SubCategory({
    category: req.body.category,
    subCategoryName: req.body.subCategoryName,
    picture: req.body.picture || "",
    path: req.body.path,
    description: req.body.description || "",
  });

  // Check if SubCategory exists
  const subCategoryExists = await SubCategory.findOne({
    path: req.body.path,
    active: 1,
  });

  if (subCategoryExists) {
    res.status(400);
    throw new Error("Path already exists");
  }

  const savedData = await subCategory.save();

  // push item to subCategories in category schema
  const category = await Category.findById(req.body.category);
  await category.updateOne({ $push: { subCategories: savedData._id } });

  // savedData.category = category;

  res
    .status(200)
    .json(await SubCategory.findById(savedData._id).populate("category"));
});

const update = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (subCategory.picture !== req.body.picture) {
    await handleRemoveFile(subCategory.picture);
  }

  const check = ObjectId(subCategory.category) == ObjectId(req.body.category);

  subCategory.category = req.body.category;
  subCategory.subCategoryName = req.body.subCategoryName;
  subCategory.picture = req.body.picture;
  subCategory.path = req.body.path;
  subCategory.description = req.body.description;

  if (subCategory.path != req.body.path) {
    // Check if SubCategory exists
    const subCategoryExists = await SubCategory.findOne({
      path: req.body.path,
      active: 1,
    });

    if (subCategoryExists) {
      res.status(400);
      throw new Error("Path already exists");
    }
  }

  const savedData = await subCategory.save();

  if (!check) {
    // pull
    await Category.updateMany(
      { subCategories: req.params.id },
      { $pull: { subCategories: req.params.id } }
    );

    // push item to subCategories in category schema
    const category = await Category.findById(req.body.category);
    await category.updateOne({ $push: { subCategories: savedData._id } });
  }

  res
    .status(200)
    .json(await SubCategory.findById(savedData._id).populate("category"));
});

const remove = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  }).populate("category");
  if (subCategory.picture) await handleRemoveFile(subCategory.picture);

  subCategory.active = -1;

  const savedData = await subCategory.save();

  await Category.updateMany(
    { subCategories: req.params.id },
    { $pull: { subCategories: req.params.id } }
  );

  // await Post.updateMany({ subCategory: req.params.id }, { active: -1 });

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
