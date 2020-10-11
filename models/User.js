const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
});

module.exports = model('User', schema);
