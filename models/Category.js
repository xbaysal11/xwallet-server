const { Schema, model, Types } = require('mongoose');

let schema = new Schema({
  name: { type: String, required: true },
  owner: { type: Types.ObjectId, ref: 'User' },
  type: { type: Number, required: true },
});
schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = model('Category', schema);
