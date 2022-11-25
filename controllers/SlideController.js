const asyncHandler = require("express-async-handler");
const Slide = require("../models/Slide");
const { ObjectId } = require("mongodb");

// @desc    GET slides
// @route   GET /api/slides/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const slides = await Slide.find(query).sort(sort);

  res.status(200).json(slides);
});

// @desc    POST slides
// @route   POST /api/slides/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const sort = { createdAt: -1 };
  const slides = await Slide.find(query).sort(sort);

  res.status(200).json(slides);
});

// @desc    Get slides
// @route   GET /api/slides/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const slide = await Slide.findById(query);

  res.status(200).json(slide);
});

// @desc    POST slides
// @route   POST /api/slides
// @access  Private
const create = asyncHandler(async (req, res) => {
  const slide = new Slide({
    picture: req.body.picture,
    slideName: req.body.slideName,
    description: req.body.description,
  });

  const savedData = await slide.save();
  res.status(200).json(savedData);
});

// @desc    PUT slides
// @route   PUT /api/slides/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const slide = await Slide.findById(req.params.id);
  slide.picture = req.body.picture;
  slide.slideName = req.body.slideName;
  slide.description = req.body.description;

  const savedData = await slide.save();
  res.status(200).json(savedData);
});

// @desc    DELETE slides
// @route   DELETE /api/slides/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const slide = await Slide.findById(req.params.id);
  slide.isActive = -1;

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
