const asyncHandler = require("express-async-handler");
const News = require("../models/News");
const Color = require("../models/Color");
const { ObjectId } = require("mongodb");

// @desc    GET newss
// @route   GET /api/newss/
// @access  Private
const get = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const newsList = await News.find(query);

  res.status(200).json(newsList);
});

// @desc    POST newss
// @route   POST /api/newss/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const query = { isActive: 1 };
  const newsList = await News.find(query);

  res.status(200).json(newsList);
});

// @desc    Get newss
// @route   GET /api/newss/:id
// @access  Private
const getById = asyncHandler(async (req, res) => {
  const query = { _id: ObjectId(req.params.id), isActive: 1 };
  const news = await News.findById(query);

  res.status(200).json(news);
});

// @desc    POST newss
// @route   POST /api/newss
// @access  Private
const create = asyncHandler(async (req, res) => {
  const news = new News({
    staff: req.body.staff,
    title: req.body.title,
    thumbnail: req.body.thumbnail,
    content: req.body.content,
    datePost: req.body.datePost,
  });

  const savedData = await news.save();
  res.status(200).json(savedData);
});

// @desc    PUT newss
// @route   PUT /api/newss/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  news.staff = req.body.staff;
  news.title = req.body.title;
  news.thumbnail = req.body.thumbnail;
  news.content = req.body.content;
  news.datePost = req.body.datePost;

  const savedData = await news.save();
  res.status(200).json(savedData);
});

// @desc    DELETE newss
// @route   DELETE /api/newss/:id
// @access  Private
const remove = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  news.isActive = -1;

  const savedData = await news.save();
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
