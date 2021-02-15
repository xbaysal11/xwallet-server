const Wallet = require('../models/Wallet');

exports.create = async (req, res) => {
  try {
    const { name, balance, type } = req.body;
    const wallet = new Wallet({
      name,
      balance,
      type,
      owner: req.user.userId,
    });
    await wallet.save();
    res.status(201).json(wallet);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let total = 0;
    const wallet = await Wallet.find({ owner: req.user.userId });
    await wallet.map((item) => {
      total = total + item.balance;
    });
    res.json({ total, wallet });
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);
    res.json(wallet);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(wallet);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const wallet = await Wallet.findByIdAndRemove(req.params.id);
    res.json({
      message: 'Wallet was deleted successfully!',
    });
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};
