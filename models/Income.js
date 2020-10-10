const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    income: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
    categoryId: { type: Types.ObjectId, ref: 'IncomeCategory', required: true },
    destinationId: { type: Types.ObjectId, ref: 'Wallet', required: true },
    owner: { type: Types.ObjectId, ref: 'User' },
});

module.exports = model('Income', schema);
