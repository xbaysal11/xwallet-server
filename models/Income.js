const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    income: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    categoryId: { type: Types.ObjectId, ref: 'IncomeCategory', required: true },
    categoryName: { type: String },
    destinationId: { type: Types.ObjectId, ref: 'Wallet', required: true },
    destinationName: { type: String },
    owner: { type: Types.ObjectId, ref: 'User' },
});

module.exports = model('Income', schema);
