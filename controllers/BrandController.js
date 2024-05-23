const asyncHandler = require("express-async-handler");
const Brand = require("../models/Brand");
const Product = require("../models/Product");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };

  const brands = await Brand.find(query).sort(sort);

  res.status(200).json(brands);
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
          { brandName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  // const brands = await Brand.find(query).sort(sort);
  const [brands, total] = await Promise.all([
    Brand.find(query).sort(sort).skip(skip).limit(limit),
    Brand.countDocuments(query),
  ]);
  res.status(200).json({ brands, total });

});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const brand = await Brand.findOne(query);

  res.status(200).json(brand);
  
});

const create = asyncHandler(async (req, res) => {
  const brand = new Brand({
    brandName: req.body.brandName,
    picture: req.body.picture || "",
    description: req.body.description || "",
  });

  const savedData = await brand.save();

  res.status(200).json(await Brand.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (brand.picture !== req.body.picture) {
    await handleRemoveFile(brand.picture);
  }

  brand.brandName = req.body.brandName;
  brand.picture = req.body.picture;
  brand.description = req.body.description;

  const savedData = await brand.save();
  res.status(200).json(await Brand.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  if (brand.picture) await handleRemoveFile(brand.picture);

  brand.active = -1;

  await Product.updateMany({ brand: req.params.id }, { active: -1 });

  const savedData = await brand.save();
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
