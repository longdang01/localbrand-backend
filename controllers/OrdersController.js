const asyncHandler = require("express-async-handler");
const Orders = require("../models/Orders");
const Product = require("../models/Product");
const OrdersDetail = require("../models/OrdersDetail");
const Cart = require("../models/Cart");
const CartDetail = require("../models/CartDetail");
const Color = require("../models/Color");
const Size = require("../models/Size");
const Customer = require("../models/Customer");
const { ObjectId } = require("mongodb");
const { generateCodeRandom } = require("../utils/Functions");
const DeliveryAddress = require("../models/DeliveryAddress");
const { sendAfterOrders } = require("../utils/Mail");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const orderses = await Orders.find(query)
    .sort(sort)
    .populate("ordersDetails")
    .populate("ordersStatuses");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Orders.find(query).sort(sort).countDocuments();
  const products = await Product.find(query);

  // res.status(200).json({ orderses: orderses, count: count });
  res.status(200).json({ orderses: orderses, products: products });
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
          { ordersCode: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const [orders, total] = await Promise.all([
    Orders.find(query)
      .sort(sort)
      .populate("deliveryAddress")
      .populate({
        path: "ordersDetails",
        populate: [
          {
            path: "color",
            model: "Color",
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
          },
          {
            path: "size",
            model: "Size",
          },
          {
            path: "product",
            model: "Product",
            populate: [
              {
                path: "colors",
                model: "Color",
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
              },
            ],
          },
        ],
      })
      .populate("ordersStatuses")
      .skip(skip)
      .limit(limit),
    Orders.countDocuments(query),
  ]);
  // const orderses = await Orders.find(query)
  //   .sort(sort)
  //   .populate("deliveryAddress")
  //   .populate({
  //     path: "ordersDetails",
  //     populate: [
  //       {
  //         path: "color",
  //         model: "Color",
  //         populate: [
  //           {
  //             path: "sizes",
  //             model: "Size",
  //           },
  //           {
  //             path: "images",
  //             model: "ColorImage",
  //           },
  //           {
  //             path: "discount",
  //             model: "Discount",
  //           },
  //         ],
  //       },
  //       {
  //         path: "size",
  //         model: "Size",
  //       },
  //       {
  //         path: "product",
  //         model: "Product",
  //         populate: [
  //           {
  //             path: "colors",
  //             model: "Color",
  //             populate: [
  //               {
  //                 path: "sizes",
  //                 model: "Size",
  //               },
  //               {
  //                 path: "images",
  //                 model: "ColorImage",
  //               },
  //               {
  //                 path: "discount",
  //                 model: "Discount",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   })
  //   .populate("ordersStatuses");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Orders.find(query).sort(sort).countDocuments();

  // res.status(200).json({ orderses: orderses, count: count });
  const products = await Product.find({ active: 1 });

  res.status(200).json({ orders: orders, products: products, total });
});

const searchByClient = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };
  // status,

  // const page = Number(req.body.page) || 1;
  // const pageSize = Number(req.body.pageSize);

  const query = req.body.status
    ? {
        $and: [
          { status: req.body.status },
          { customer: req.body.customer },
          { active: 1 },
        ],
      }
    : { $and: [{ active: 1 }, { customer: req.body.customer }] };

  const orderses = await Orders.find(query)
    .sort(sort)
    .populate("ordersDetails")
    .populate("ordersStatuses");
  // .skip(pageSize * (page - 1))
  // .limit(pageSize);

  // const count = await Orders.find(query).sort(sort).countDocuments();

  // res.status(200).json({ orderses: orderses, count: count });
  const products = await Product.find(query);

  res.status(200).json({ orderses: orderses, products: products });
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const orders = await Orders.findOne(query)
    .populate({
      path: "ordersDetails",
      populate: [
        {
          path: "product",
          model: "Product",
        },
        {
          path: "color",
          model: "Color",
        },
        {
          path: "size",
          model: "Size",
        },
      ],
    })
    .populate("ordersStatuses")
    .populate({
      path: "customer",
      model: "Customer"
    });

  res.status(200).json(orders);
});

const getByCode = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { ordersCode: req.body.ordersCode }],
  };

  const order = await Orders.findOne(query)
    .populate({
      path: "ordersDetails",
      populate: [
        {
          path: "product",
          model: "Product",
        },
        {
          path: "color",
          model: "Color",
        },
        {
          path: "size",
          model: "Size",
        },
      ],
    })
    .populate("ordersStatuses")
    .populate("customer");


  res.status(200).json(order);
});

const create = asyncHandler(async (req, res) => {
  // details
  const query = { active: 1 };
  const orderses = (await Orders.find(query)) || [];

  const ordersCode = await generateCodeRandom("OD", orderses, "ordersCode", 5);

  let deliveryAddress = "";
  if (req.body.customer) {
    deliveryAddress = await DeliveryAddress.findOne({
      $and: [{ active: 1 }, { customer: ObjectId(req.body.customer) }],
    });

    if (!deliveryAddress) {
      res.status(400);
      throw new Error("Chưa có thông tin địa chỉ nhận hàng!");
    }
  }

  const orders = new Orders({
    customer: req.body.customer || null,
    deliveryAddress: deliveryAddress ? deliveryAddress._id : null,
    ordersCode: ordersCode,
    note: req.body.note,
    status: Number(req.body.status),
    payment: Number(req.body.payment),
    transportFee: Number(req.body.transportFee),
    total: Number(req.body.total),
    paid: Number(req.body.paid),
  });

  const details = req.body.details;
  details.forEach(async (item) => {
    const ordersDetail = new OrdersDetail({
      orders: orders._id,
      product: item.product._id,
      color: item.color._id,
      size: item.size._id,
      price: item.color.discount
        ? item.color.discount.symbol == 1
          ? Math.round(
              Number(item.color.price) *
                ((100 - Number(item.color.discount.value)) / 100)
            )
          : Math.round(
              Number(item.color.price) - Number(item.color.discount.value)
            )
        : Number(item.color.price),
      quantity: Number(item.quantity),
    });
    // Number(item.price)
    const savedOrdersDetail = await ordersDetail.save();

    // update quantity (size)
    const size = await Size.findOne({
      $and: [{ active: 1 }, { _id: ObjectId(item.size._id) }],
    });
    size.quantity = Number(size.quantity) - Number(item.quantity);
    await size.save();

    // push
    await orders.updateOne({
      $push: { ordersDetails: savedOrdersDetail._id },
    });

    if (req.body.customer) {
      const cartDetail = await CartDetail.findById(item._id);
      cartDetail.active = -1;
      await cartDetail.save();

      const cart = Cart.findById(item.cart);
      await cart.updateOne({ $pull: { cartDetails: item._id } });
    }
  });

  const savedData = await orders.save();

  const dataSend = {
    // link: `${process.env.BASE_URL}/api/users/verify/${user._id}/${access_token}`,
    link: `${process.env.BASE_URL}/orders/${savedData.ordersCode}/`,
  };
  console.log(dataSend);
  console.log(req.body.customer);
  if (req.body.customer) {
    const customerSelect = await Customer.findOne({
      $and: [{ active: 1 }, { _id: ObjectId(req.body.customer) }],
    }).populate("user");
    await sendAfterOrders(
      customerSelect.user.email,
      "[FRAGILE] Thư Cảm Ơn Bạn Đã Đặt Hàng",
      dataSend
    );
  }
  // const res1 = await Orders.findById(savedData._id).populate("ordersDetails");
  // res.status(200).json(res1);
  res
    .status(200)
    .json(
      await Orders.findById(savedData._id)
        .populate("ordersDetails")
        .populate("ordersStatuses")
    );
});

const update = asyncHandler(async (req, res) => {
  const orders = await Orders.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  })
    .populate({
      path: "ordersDetails",
      populate: [
        {
          path: "product",
          model: "Product",
        },
        {
          path: "color",
          model: "Color",
        },
        {
          path: "size",
          model: "Size",
        },
      ],
    })
    .populate("ordersStatuses");

  orders.customer = req.body.customer;
  orders.deliveryAddress = req.body.deliveryAddress;
  orders.ordersCode = req.body.ordersCode;
  orders.note = req.body.note;
  orders.transportFee = req.body.transportFee;
  orders.total = req.body.total;
  orders.status = req.body.status;
  orders.payment = req.body.payment;
  orders.paid = req.body.paid;

  if (orders.status == 6) {
    orders.ordersDetails.forEach(async (item) => {
      const size = await Size.findOne({
        $and: [{ active: 1 }, { _id: ObjectId(item.size._id) }],
      });
      size.quantity = Number(size.quantity) + Number(item.quantity);
      await size.save();
    });
  }

  const savedData = await orders.save();
  console.log(orders);

  res
    .status(200)
    .json(
      await Orders.findById(savedData._id)
        .populate("ordersDetails")
        .populate("ordersStatuses")
    );
});

const remove = asyncHandler(async (req, res) => {
  const orders = await Orders.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  })
    .populate({
      path: "ordersDetails",
      populate: [
        {
          path: "product",
          model: "Product",
        },
        {
          path: "color",
          model: "Color",
        },
        {
          path: "size",
          model: "Size",
        },
      ],
    })
    .populate("ordersStatuses");

  // if (orders.status >= 2 && orders.status <= 5)
  //   orders.ordersDetails.forEach(async (item) => {
  //     const size = await Size.findOne({
  //       $and: [{ active: 1 }, { _id: ObjectId(item.size._id) }],
  //     });
  //     size.quantity = Number(size.quantity) + Number(item.quantity);
  //     await size.save();
  //   });

  orders.active = -1;
  const savedData = await orders.save();
  await OrdersDetail.updateMany({ orders: req.params.id }, { active: -1 });

  res.status(200).json(savedData);
});

module.exports = {
  get,
  search,
  searchByClient,
  getById,
  getByCode,
  create,
  update,
  remove,
};
