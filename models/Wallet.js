const { Schema, model, Types } = require('mongoose');

let schema = new Schema({
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  type: { type: String, required: true },
  owner: { type: Types.ObjectId, ref: 'User' },
});
schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('Wallet', schema);
