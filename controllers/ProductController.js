const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Orders = require("../models/Orders");
const OrdersDetail = require("../models/OrdersDetail");
const Brand = require("../models/Brand");
const Discount = require("../models/Discount");
const Supplier = require("../models/Supplier");
const Collection = require("../models/Collection");
const Color = require("../models/Color");
const { ObjectId } = require("mongodb");

// // @desc    GET products
// // @route   GET /api/products/
// // @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
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
          path: "sales",
          model: "Discount",
        },
        {
          path: "codes",
          model: "Discount",
        },
      ],
    });

  const categories = await Category.find(query).populate("subCategories");
  const brands = await Brand.find(query).sort(sort);
  const suppliers = await Supplier.find(query).sort(sort);
  const collections = await Collection.find(query)
    .sort(sort)
    .populate("images")
    .populate("products");

  res.status(200).json({
    products: products,
    categories: categories,
    brands: brands,
    suppliers: suppliers,
    collections: collections,
  });
});

// // @desc    GET products
// // @route   GET /api/products/get-bestsellers
// // @access  Private
const getNew = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const products = await Product.find(query)
    .sort(sort)
    .limit(8)
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
          path: "sales",
          model: "Discount",
        },
        {
          path: "sales",
          model: "Discount",
        },
        {
          path: "codes",
          model: "Discount",
        },
      ],
    });

  res.status(200).json({
    products: products,
  });
});

// // @desc    GET products
// // @route   GET /api/products/get-bestsellers
// // @access  Private
const getBestSellers = asyncHandler(async (req, res) => {
  const results = await Orders.find({ status: 3 }).populate("ordersDetails");
  let products = [];
  results.forEach((item) => {
    item.ordersDetails.forEach((item) => {
      if (products.findIndex((ele) => ele == item.product) == -1) {
        products.push(item.product.toString());
      }
    });
  });

  console.log(products);

  // res.status(200).json({ products: results });

  // const results = await OrdersDetail.aggregate([
  //   { $match: { status: 0 } },
  //   {
  //     $group: {
  //       _id: "$product",
  //       sum_val: { $sum: "$quantity" },
  //     },
  //   },
  // ])
  //   .sort({ sum_val: -1 })
  //   .limit(8);

  // console.log(results);
  let productBestSellers = [];
  await Promise.all(
    products.map(async (item) => {
      let product = await Product.findOne({ _id: ObjectId(item) })
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
              path: "sales",
              model: "Discount",
            },
            {
              path: "sales",
              model: "Discount",
            },
            {
              path: "codes",
              model: "Discount",
            },
          ],
        });

      productBestSellers.push(product);
    })
  );

  res.status(200).json({ products: productBestSellers });
});

// // @desc    GET products
// // @route   GET /api/products/get-sales
// // @access  Private
const getSales = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const results = await Product.find(query)
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
          path: "sales",
          model: "Discount",
        },
        {
          path: "codes",
          model: "Discount",
        },
      ],
    });

  let products = [];
  results.forEach((item) => {
    item.colors.forEach((item) => {
      if (item.sales.length != 0) {
        products.push(item.product);
      }
    });
  });

  let productSales = [];
  await Promise.all(
    products.map(async (item) => {
      let product = await Product.findOne({ _id: item })
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
              path: "sales",
              model: "Discount",
            },
            {
              path: "sales",
              model: "Discount",
            },
            {
              path: "codes",
              model: "Discount",
            },
          ],
        });

      productSales.push(product);
    })
  );

  res.status(200).json({ products: productSales });
});

// @desc    POST products
// @route   POST /api/products/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };
  let query = { isActive: 1 };
  let hasCategory = null;

  // search by category
  if (req.body.category) {
    // query = { isActive: 1 };
    hasCategory = { category: req.body.category };
  }

  // search by subCategory
  if (req.body.subCategory) {
    query = {
      $and: [{ subCategory: req.body.subCategory }, { isActive: 1 }],
    };
  }

  // search by name
  if (req.body.keyword) {
    query = {
      $and: [
        // { productName: { $regex: ".*" + req.body.keyword + ".*" } },
        { productName: { $regex: req.body.keyword, $options: "i" } },
        { isActive: 1 },
      ],
    };
  }
  // products =
  await Product.find(query)
    .sort(sort)
    .populate("subCategory", null, hasCategory)
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
          path: "sales",
          model: "Discount",
        },
        {
          path: "sales",
          model: "Discount",
        },
        {
          path: "codes",
          model: "Discount",
        },
      ],
    })
    .exec(async (err, docs) => {
      // console.log(docs);
      // items not match with condition => subCategory = null =>
      // filter => item match
      console.log(docs);
      docs = docs.filter(function (doc) {
        return doc.subCategory != null;
      });
      // get related
      const categories = await Category.find({ isActive: 1 }).populate(
        "subCategories"
      );
      const brands = await Brand.find({ isActive: 1 }).sort(sort);
      const suppliers = await Supplier.find({ isActive: 1 }).sort(sort);
      const collections = await Collection.find({ isActive: 1 })
        .sort(sort)
        .populate("images")
        .populate("products");

      res.status(200).json({
        products: docs,
        categories: categories,
        brands: brands,
        suppliers: suppliers,
        collections: collections,
      });
    });
});

// @desc    Get products
// @route   GET /api/products/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
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
          path: "sales",
          model: "Discount",
        },
        {
          path: "sales",
          model: "Discount",
        },
        {
          path: "codes",
          model: "Discount",
        },
      ],
    });

  res.status(200).json(product);
});

// @desc    POST products
// @route   POST /api/products
// @access  Private
const create = asyncHandler(async (req, res) => {
  const product = new Product({
    subCategory: req.body.subCategory,
    brand: req.body.brand,
    collectionInfo: req.body.collectionInfo,
    supplier: req.body.supplier,
    productName: req.body.productName,
    origin: req.body.origin,
    material: req.body.material,
    style: req.body.style,
    sizeGuide: req.body.sizeGuide,
    description: req.body.description,
  });

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
            path: "sales",
            model: "Discount",
          },
          {
            path: "sales",
            model: "Discount",
          },
          {
            path: "codes",
            model: "Discount",
          },
        ],
      })
  );
});

// @desc    PUT products
// @route   PUT /api/products/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
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
            path: "sales",
            model: "Discount",
          },

          {
            path: "codes",
            model: "Discount",
          },
        ],
      })
  );
});

// @desc    DELETE products
// @route   DELETE /api/products/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.isActive = -1;

  Color.updateMany({ product: req.params.id }, { product: null });
  const savedData = await product.save();
  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  getNew,
  getBestSellers,
  getSales,
  getById,
  create,
  update,
  remove,
};
