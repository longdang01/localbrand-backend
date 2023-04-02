const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");
const SubCategory = require("../models/SubCategory");
const Brand = require("../models/Brand");
const Supplier = require("../models/Supplier");
const Collection = require("../models/Collection");
const Color = require("../models/Color");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const products = await Product.find(query)
    .sort(sort)
    .populate("subCategory")
    .populate({
      path: "colors",
      populate: [
        {
          path: "sizes",
          model: "Size",
        },
        {
          path: "images",
          model: "ColorImage",
        },
        {
          path: "discount",
          model: "Discount",
        },
      ],
    });

  const subCategories = await SubCategory.find(query);
  const brands = await Brand.find(query).sort(sort);
  const suppliers = await Supplier.find(query).sort(sort);
  const collections = await Collection.find(query).sort(sort);

  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Product.find(query).sort(sort).countDocuments();

  // res.status(200).json({ products: products, count: count });
  res.status(200).json({
    products: products,
    subCategories: subCategories,
    brands: brands,
    suppliers: suppliers,
    collections: collections,
  });
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.searchData
    ? {
        $and: [
          { productName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const products = await Product.find(query)
    .sort(sort)
    .populate("subCategory")
    .populate({
      path: "colors",
      populate: [
        {
          path: "sizes",
          model: "Size",
        },
        {
          path: "images",
          model: "ColorImage",
        },
        {
          path: "discount",
          model: "Discount",
        },
      ],
    });
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Product.find(query).sort(sort).countDocuments();

  // res.status(200).json({ products: products, count: count });
  const subCategories = await SubCategory.find(query);
  const brands = await Brand.find(query).sort(sort);
  const suppliers = await Supplier.find(query).sort(sort);
  const collections = await Collection.find(query).sort(sort);

  res.status(200).json({
    products: products,
    subCategories: subCategories,
    brands: brands,
    suppliers: suppliers,
    collections: collections,
  });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const product = await Product.findOne(query)
    .populate("subCategory")
    .populate({
      path: "colors",
      populate: [
        {
          path: "sizes",
          model: "Size",
        },
        {
          path: "images",
          model: "ColorImage",
        },
        {
          path: "discount",
          model: "Discount",
        },
      ],
    });

  res.status(200).json(product);
});

const create = asyncHandler(async (req, res) => {
  const product = new Product({
    subCategory: req.body.subCategory,
    brand: req.body.brand,
    collectionInfo: req.body.collectionInfo,
    supplier: req.body.supplier,
    productName: req.body.productName,
    path: req.body.path,
    origin: req.body.origin,
    material: req.body.material,
    style: req.body.style,
    sizeGuide: req.body.sizeGuide || "",
    description: req.body.description || "",
  });

  // Check if Product exists
  const productExists = await Product.findOne({
    path: req.body.path,
    active: 1,
  });

  if (productExists) {
    res.status(400);
    throw new Error("Path đã tồn tại");
  }

  const savedData = await product.save();

  res.status(200).json(
    await Product.findById(savedData._id)
      .populate("subCategory")
      .populate({
        path: "colors",
        populate: [
          {
            path: "sizes",
            model: "Size",
          },
          {
            path: "images",
            model: "ColorImage",
          },
          {
            path: "discount",
            model: "Discount",
          },
        ],
      })
  );
});

const update = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (product.sizeGuide !== req.body.sizeGuide) {
    await handleRemoveFile(product.sizeGuide);
  }

  product.subCategory = req.body.subCategory;
  product.brand = req.body.brand;
  product.collectionInfo = req.body.collectionInfo;
  product.supplier = req.body.supplier;
  product.productName = req.body.productName;
  product.origin = req.body.origin;
  product.material = req.body.material;
  product.style = req.body.style;
  product.sizeGuide = req.body.sizeGuide;
  product.description = req.body.description;

  if (product.path != req.body.path) {
    // Check if Product exists
    const productExists = await Product.findOne({
      path: req.body.path,
      active: 1,
    });

    if (productExists) {
      res.status(400);
      throw new Error("Path already exists");
    }
  }

  const savedData = await product.save();
  res.status(200).json(
    await Product.findById(savedData._id)
      .populate("subCategory")
      .populate({
        path: "colors",
        populate: [
          {
            path: "sizes",
            model: "Size",
          },
          {
            path: "images",
            model: "ColorImage",
          },
          {
            path: "discount",
            model: "Discount",
          },
        ],
      })
  );
});

const remove = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  })
    .populate("subCategory")
    .populate({
      path: "colors",
      populate: [
        {
          path: "sizes",
          model: "Size",
        },
        {
          path: "images",
          model: "ColorImage",
        },
        {
          path: "discount",
          model: "Discount",
        },
      ],
    });

  if (product.sizeGuide) await handleRemoveFile(product.sizeGuide);

  product.active = -1;
  const savedData = await product.save();

  // subCategory

  // await SubCategory.updateMany({ product: req.params.id }, { product: null });
  await Color.updateMany({ product: req.params.id }, { active: -1 });
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
