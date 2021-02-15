const MoneyOperation = require('../models/MoneyOperation');
const Wallet = require('../models/Wallet');
const Category = require('../models/Category');

exports.create = async (req, res) => {
  try {
    const {
      amount,
      comment,
      date,
      categoryId,
      walletId,
      fromWalletId,
      toWalletId,
      // type,
    } = req.body;

    let walletModel, MoneyOperationModel;
    if (!categoryId && !walletId) {
      if (fromWalletId && toWalletId) {
        fromWalletModel = await Wallet.findOneAndUpdate(
          { owner: req.user.userId, _id: fromWalletId },
          { $inc: { balance: -amount } },
          { new: true }
        );
        toWalletModel = await Wallet.findOneAndUpdate(
          { owner: req.user.userId, _id: toWalletId },
          { $inc: { balance: amount } },
          { new: true }
        );

        MoneyOperationModel = new MoneyOperation({
          amount,
          comment,
          date,
          fromWallet: {
            walletId: fromWalletId,
            walletName: fromWalletModel.name,
          },
          toWallet: {
            walletId: toWalletId,
            walletName: toWalletModel.name,
          },
          owner: req.user.userId,
          type: 3,
        });
      }
    } else {
      const category = await Category.findOne({
        owner: req.user.userId,
        _id: categoryId,
      });
      if (category.type === 1) {
        walletModel = await Wallet.findOneAndUpdate(
          { owner: req.user.userId, _id: walletId },
          { $inc: { balance: -amount } },
          { new: true }
        );
      } else if (category.type === 2) {
        walletModel = await Wallet.findOneAndUpdate(
          { owner: req.user.userId, _id: walletId },
          { $inc: { balance: amount } },
          { new: true }
        );
      }
    }
    await MoneyOperationModel.save();

    let total = 0;
    const wallet = await Wallet.find({ owner: req.user.userId });
    wallet.map((item) => {
      total = total + item.balance;
    });
    res.status(201).json({ total, MoneyOperationModel });
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let moneyOperation;
    if (req.query.type) {
      moneyOperation = await MoneyOperation.find({
        owner: req.user.userId,
        type: req.query.type,
      });
    } else {
      moneyOperation = await MoneyOperation.find({
        owner: req.user.userId,
      });
    }

    res.json(moneyOperation);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const moneyOperation = await MoneyOperation.findById(req.params.id);
    res.json(moneyOperation);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.update = async (req, res) => {
  try {
    let moneyOperationNext, moneyOperationPrev;
    moneyOperationPrev = await MoneyOperation.findById(req.params.id);
    if (moneyOperationPrev.type === 3) {
      moneyOperationNext = await MoneyOperation.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (req.body.amount >= moneyOperationPrev.amount) {
        let diff = req.body.amount - moneyOperationPrev.amount;
        await Wallet.findOneAndUpdate(
          {
            owner: req.user.userId,
            _id: moneyOperationPrev.fromWallet.walletId,
          },
          { $inc: { balance: -diff } },
          { new: true }
        );
        await Wallet.findOneAndUpdate(
          {
            owner: req.user.userId,
            _id: moneyOperationPrev.toWallet.walletId,
          },
          { $inc: { balance: diff } },
          { new: true }
        );
      } else {
        let diff = moneyOperationPrev.amount - req.body.amount;
        await Wallet.findOneAndUpdate(
          {
            owner: req.user.userId,
            _id: moneyOperationPrev.fromWallet.walletId,
          },
          { $inc: { balance: diff } },
          { new: true }
        );
        await Wallet.findOneAndUpdate(
          {
            owner: req.user.userId,
            _id: moneyOperationPrev.toWallet.walletId,
          },
          { $inc: { balance: -diff } },
          { new: true }
        );
      }
    } else {
      moneyOperationPrev = await MoneyOperation.findById(req.params.id);
      if (req.body.amount) {
        if (req.body.amount >= moneyOperationPrev.amount) {
          let diff = req.body.amount - moneyOperationPrev.amount;
          if (moneyOperationPrev.type === 1) {
            await Wallet.findOneAndUpdate(
              {
                owner: req.user.userId,
                _id: moneyOperationPrev.wallet.walletId,
              },
              { $inc: { balance: -diff } },
              { new: true }
            );
          } else if (moneyOperationPrev.type === 2) {
            await Wallet.findOneAndUpdate(
              {
                owner: req.user.userId,
                _id: moneyOperationPrev.wallet.walletId,
              },
              { $inc: { balance: diff } },
              { new: true }
            );
          }
        } else {
          let diff = moneyOperationPrev.amount - req.body.amount;
          if (moneyOperationPrev.type === 1) {
            await Wallet.findOneAndUpdate(
              {
                owner: req.user.userId,
                _id: moneyOperationPrev.wallet.walletId,
              },
              { $inc: { balance: diff } },
              { new: true }
            );
          } else if (moneyOperationPrev.type === 2) {
            await Wallet.findOneAndUpdate(
              {
                owner: req.user.userId,
                _id: moneyOperationPrev.wallet.walletId,
              },
              { $inc: { balance: -diff } },
              { new: true }
            );
          }
        }
      }
      moneyOperationNext = await MoneyOperation.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
    }

    res.json(moneyOperationNext);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const moneyOperation = await MoneyOperation.findByIdAndRemove(
      req.params.id
    );
    if (moneyOperation.type === 1) {
      await Wallet.findOneAndUpdate(
        { owner: req.user.userId, _id: moneyOperation.wallet.walletId },
        { $inc: { balance: moneyOperation.amount } },
        { new: true }
      );
    } else if (moneyOperation.type === 2) {
      await Wallet.findOneAndUpdate(
        { owner: req.user.userId, _id: moneyOperation.wallet.walletId },
        { $inc: { balance: -moneyOperation.amount } },
        { new: true }
      );
    }

    console.log(moneyOperation);
    res.json({
      message: 'Money operation was deleted successfully!',
    });
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};
