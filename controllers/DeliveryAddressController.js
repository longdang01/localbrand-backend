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
  const sort = { createdAt: 1 };

  const query = req.body.searchData
    ? {
        $and: [
          {
            deliveryAddressName: { $regex: req.body.searchData, $options: "i" },
          },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const deliveryAddresses = await DeliveryAddress.find(query).sort(sort);
  res.status(200).json(deliveryAddresses);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const deliveryAddress = await DeliveryAddress.findOne(query);

  res.status(200).json(deliveryAddress);
});

const create = asyncHandler(async (req, res) => {
  if (req.body.isActive == 1) {
    await DeliveryAddress.updateMany({ active: 1 }, { $set: { active: 0 } });
  }

  const deliveryAddress = new DeliveryAddress({
    customer: req.body.customer,
    deliveryAddressName: req.body.deliveryAddressName,
    consigneeName: req.body.consigneeName,
    consigneePhone: req.body.consigneePhone,
    active: req.body.active,
  });

  const savedData = await deliveryAddress.save();

  res.status(200).json(await DeliveryAddress.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const deliveryAddress = await DeliveryAddress.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });
  deliveryAddress.customer = req.body.customer;
  deliveryAddress.deliveryAddressName = req.body.deliveryAddressName;
  deliveryAddress.consigneeName = req.body.consigneeName;
  deliveryAddress.consigneePhone = req.body.consigneePhone;
  deliveryAddress.active = req.body.active;

  if (deliveryAddress.active == 1) {
    await DeliveryAddress.updateMany({ active: 1 }, { $set: { active: 0 } });
  }

  const savedData = await deliveryAddress.save();
  res.status(200).json(await DeliveryAddress.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const deliveryAddress = await DeliveryAddress.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
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
