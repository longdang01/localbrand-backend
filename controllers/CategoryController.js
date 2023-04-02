const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const categories = await Category.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Category.find(query).sort(sort).countDocuments();

  // res.status(200).json({ categories: categories, count: count });
  res.status(200).json(categories);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: 1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          { categoryName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const categories = await Category.find(query).sort(sort);
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Category.find(query).sort(sort).countDocuments();

  // res.status(200).json({ categories: categories, count: count });
  res.status(200).json(categories);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const category = await Category.findOne(query).populate("subCategories");

  res.status(200).json(category);
});

const create = asyncHandler(async (req, res) => {
  const category = new Category({
    categoryName: req.body.categoryName,
    picture: req.body.picture || "",
    path: req.body.path,
    description: req.body.description || "",
  });

  // Check if Category exists
  const categoryExists = await Category.findOne({
    path: req.body.path,
    active: 1,
  });

  if (categoryExists) {
    res.status(400);
    throw new Error("Path đã tồn tại");
  }

  const savedData = await category.save();

  res
    .status(200)
    .json(await Category.findById(savedData._id).populate("subCategories"));
});

const update = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (category.picture !== req.body.picture) {
    await handleRemoveFile(category.picture);
  }

  category.categoryName = req.body.categoryName;
  category.picture = req.body.picture;
  category.path = req.body.path;
  category.description = req.body.description;

  if (category.path != req.body.path) {
    // Check if Category exists
    const categoryExists = await Category.findOne({
      path: req.body.path,
      active: 1,
    });

    if (categoryExists) {
      res.status(400);
      throw new Error("Path already exists");
    }
  }

  const savedData = await category.save();
  res
    .status(200)
    .json(await Category.findById(savedData._id).populate("subCategories"));
});

const remove = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  }).populate("subCategories");

  if (category.picture) await handleRemoveFile(category.picture);

  category.active = -1;
  const savedData = await category.save();

  // subCategory

  // await SubCategory.updateMany({ category: req.params.id }, { category: null });
  await SubCategory.updateMany({ category: req.params.id }, { active: -1 });
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
