const asyncHandler = require("express-async-handler");
const Slide = require("../models/Slide");
const { ObjectId } = require("mongodb");
const { handleRemoveFile } = require("../utils/File");

const get = asyncHandler(async (req, res) => {
  const query = { active: 1 };
  const sort = { createdAt: -1 };
  const slides = await Slide.find(query).sort(sort);

  res.status(200).json(slides);
});

const search = asyncHandler(async (req, res) => {
  const sort = { createdAt: -1 };

  const query = req.body.searchData
    ? {
        $and: [
          { slideName: { $regex: req.body.searchData, $options: "i" } },
          { active: 1 },
        ],
      }
    : { active: 1 };

  const slides = await Slide.find(query).sort(sort);

  res.status(200).json(slides);
});

const getById = asyncHandler(async (req, res) => {
  const query = {
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  };
  const slide = await Slide.findOne(query);

  res.status(200).json(slide);
});

const create = asyncHandler(async (req, res) => {
  const slide = new Slide({
    slideName: req.body.slideName || "",
    picture: req.body.picture,
    redirectLink: req.body.redirectLink || "",
    description: req.body.description || "",
  });

  const savedData = await slide.save();
  res.status(200).json(await Slide.findById(savedData._id));
});

const update = asyncHandler(async (req, res) => {
  const slide = await Slide.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  // remove image
  if (slide.picture !== req.body.picture) {
    await handleRemoveFile(slide.picture);
  }

  slide.slideName = req.body.slideName;
  slide.picture = req.body.picture;
  slide.redirectLink = req.body.redirectLink;
  slide.description = req.body.description;

  const savedData = await slide.save();
  res.status(200).json(await Slide.findById(savedData._id));
});

const remove = asyncHandler(async (req, res) => {
  const slide = await Slide.findOne({
    $and: [{ active: 1 }, { _id: ObjectId(req.params.id) }],
  });

  if (slide.picture) await handleRemoveFile(slide.picture);

  slide.active = -1;
  const savedData = await slide.save();

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
