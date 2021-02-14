const Category = require('../models/Category');

// create category
exports.create = async (req, res) => {
  try {
    const { name, type } = req.body;
    const category = new Category({
      name,
      type,
      owner: req.user.userId,
    });
    await category.save();
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

// get all categories
exports.getAll = async (req, res) => {
  try {
    const category = await Category.find({
      owner: req.user.userId,
    });
    res.json(category);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

// get all categories
exports.getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json(category);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

// get all categories
exports.update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(category);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

// get all categories
exports.delete = async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    res.json({
      message: 'Category was deleted successfully!',
    });
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};
