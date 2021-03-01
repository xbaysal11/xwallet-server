const { Schema, model, Types } = require('mongoose');

let schema = new Schema({
  amount: { type: Number, default: 0 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: Types.ObjectId, ref: 'Category' },
  wallet: { type: Types.ObjectId, ref: 'Wallet' },
  fromWallet: { type: Types.ObjectId, ref: 'Wallet' },
  toWallet: { type: Types.ObjectId, ref: 'Wallet' },
  type: { type: Number },
  owner: { type: Types.ObjectId, ref: 'User' },
});
schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = model('MoneyOperation', schema);
