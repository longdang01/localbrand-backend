const asyncHandler = require("express-async-handler");
const DeliveryAddress = require("../models/DeliveryAddress");
const { ObjectId } = require("mongodb");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: 1 };

  const deliveryAddresses = await DeliveryAddress.find(query).sort(sort);

  res.status(200).json(deliveryAddresses);
});

const search = asyncHandler(async (req, res) => {
  const sort = { updatedAt: 1 };

  const query = req.body.searchData
    ? {
        $and: [
          {
            deliveryAddressName: { $regex: req.body.searchData, $options: "i" },
          },
          { active: { $ne: -1 } },
        ],
      }
    : { active: { $ne: -1 } };

  const deliveryAddresses = await DeliveryAddress.find(query).sort(sort);
  res.status(200).json(deliveryAddresses);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: { $ne: -1 } }, { _id: ObjectId(req.params.id) }],
  };
  const deliveryAddress = await DeliveryAddress.findOne(query);

  res.status(200).json(deliveryAddress);
});

const create = asyncHandler(async (req, res) => {
  // if (req.body.active == 1) {
  //   await DeliveryAddress.updateMany({ active: 1 }, { $set: { active: 0 } });
  // }

  const deliveryAddress = new DeliveryAddress({
    customer: req.body.customer,
    deliveryAddressName: req.body.deliveryAddressName,
    consigneeName: req.body.consigneeName,
    consigneePhone: req.body.consigneePhone,
    country: req.body.country,
    province: req.body.province,
    district: req.body.district,
    ward: req.body.ward,
    active: req.body.active,
  });

  const savedData = await deliveryAddress.save();

  if (deliveryAddress.active == 1) {
    await DeliveryAddress.updateMany(
      {
        $and: [{ active: { $ne: -1 } }, { _id: { $ne: savedData._id } }],
      },
      { $set: { active: 2 } }
    );
  }

  const sort = { updatedAt: 1 };
  const query = { active: { $ne: -1 } };

  const deliveryAddresses = await DeliveryAddress.find(query).sort(sort);
  res
    .status(200)
    .json({
      data: await DeliveryAddress.findById(savedData._id),
      deliveryAddresses: deliveryAddresses,
    });
});

const update = asyncHandler(async (req, res) => {
  const deliveryAddress = await DeliveryAddress.findOne({
    $and: [{ active: { $ne: -1 } }, { _id: ObjectId(req.params.id) }],
  });

  console.log(req.body.active);
  deliveryAddress.customer = req.body.customer;
  deliveryAddress.deliveryAddressName = req.body.deliveryAddressName;
  deliveryAddress.consigneeName = req.body.consigneeName;
  deliveryAddress.consigneePhone = req.body.consigneePhone;
  deliveryAddress.country = req.body.country;
  deliveryAddress.province = req.body.province;
  deliveryAddress.district = req.body.district;
  deliveryAddress.ward = req.body.ward;
  deliveryAddress.active = req.body.active;
  const savedData = await deliveryAddress.save();

  if (deliveryAddress.active == 1) {
    await DeliveryAddress.updateMany(
      {
        $and: [{ active: { $ne: -1 } }, { _id: { $ne: savedData._id } }],
      },
      { $set: { active: 2 } }
    );
  }

  const sort = { updatedAt: 1 };
  const query = { active: { $ne: -1 } };

  const deliveryAddresses = await DeliveryAddress.find(query).sort(sort);
  res.status(200).json({
    data: await DeliveryAddress.findById(savedData._id),
    deliveryAddresses: deliveryAddresses,
  });
});

const remove = asyncHandler(async (req, res) => {
  const deliveryAddress = await DeliveryAddress.findOne({
    $and: [{ active: { $ne: -1 } }, { _id: ObjectId(req.params.id) }],
  });

  deliveryAddress.active = -1;

  const savedData = await deliveryAddress.save();
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
