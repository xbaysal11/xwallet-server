const { Schema, model, Types } = require('mongoose');

let schema = new Schema({
  amount: { type: Number, default: 0 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: {
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    categoryName: { type: String },
  },
  wallet: {
    walletId: { type: Types.ObjectId, ref: 'Wallet' },
    walletName: { type: String },
  },
  type: { type: Number },
  owner: { type: Types.ObjectId, ref: 'User' },
});
schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = model('MoneyOperation', schema);
