const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    expense: { type: Number, default: 0 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    categoryId: { type: Types.ObjectId, ref: 'ExpenseCategory', required: true },
    categoryName: { type: String},
    resourceId: { type: Types.ObjectId, ref: 'Wallet', required: true },
    resourceName: { type: String},
    owner: { type: Types.ObjectId, ref: 'User' },
});

module.exports = model('Expense', schema);
