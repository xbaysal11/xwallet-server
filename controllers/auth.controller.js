const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

// registration
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'invalid data for registration',
            });
        }

        const { email, password, firstName, lastName } = req.body;
        const condidate = await User.findOne({ email });
        if (condidate) {
            return res.status(400).json({ message: 'User is exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
        });
        await user.save();
        res.status(201).json({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            message: 'User created',
        });
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};

// authorithation
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'invalid data for login',
            });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: 'User not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'invalid password' });
        }

        const token = jwt.sign({ userId: user.id }, config.get('jwtSecretKey'));
        let total = 0;
        const wallet = await Wallet.find({ owner: user.id });
        console.log(wallet);
        await wallet.map((item) => {
            total = total + item.balance;
        });

        res.json({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            total,
            token,
        });
    } catch (e) {
        res.status(500).json({ message: 'Something is going wrong' });
    }
};
