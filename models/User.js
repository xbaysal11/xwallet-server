const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    password: { type: String, required: true },
    email: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    incomeCategory: { type: Types.ObjectId, ref: 'IncomeCategory' },
    expenseCategory: { type: Types.ObjectId, ref: 'ExpenseCategory' },
    wallet: { type: Types.ObjectId, ref: 'Wallet' },
});

module.exports = model('User', schema);
