const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: { type: String, required: true },
    balance: { type: Number, default: 0 },
    type: { type: String, required: true },
    owner: { type: Types.ObjectId, ref: 'User' },
});

module.exports = model('Wallet', schema);
