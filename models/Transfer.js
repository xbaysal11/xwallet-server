const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    amount: { type: Number, required: true, default: 0 },
    comment: { type: String },
    date: { type: Date, default: Date.now },
    resourceId: { type: Types.ObjectId, ref: 'Wallet', required: true },
    resourceName: { type: String },
    destinationId: { type: Types.ObjectId, ref: 'Wallet', required: true },
    destinationName: { type: String },
    owner: { type: Types.ObjectId, ref: 'User' },
});

module.exports = model('Transfer', schema);
