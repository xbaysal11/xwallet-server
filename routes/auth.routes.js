const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'invalid email').isEmail(),
        check('password', 'password min length is 6 symbols').isLength({
            min: 6,
        }),
        check('firstName', 'invalid first name').exists(),
        check('lastName', 'invalid last name').exists(),
    ],
    async (req, res) => {
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
                balance: user.balance,
                message: 'User created',
            });
        } catch (e) {
            res.status(500).json({
                errors: e.message,
                message: 'Something is going wrong',
            });
        }
    }
);

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'enter valid email').normalizeEmail().isEmail(),
        check('password', 'enter password').exists(),
    ],
    async (req, res) => {
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
            if (!user) {
                return res.status(400).json({ message: 'User not exist' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'invalid password' });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecretKey')
            );

            res.json({
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                balance: user.balance,
                wallet: user.wallet,
                incomeCategory: user.incomeCategory,
                expenseCategory: user.expenseCategory,
                token,
            });
        } catch (e) {
            res.status(500).json({ message: 'Something is going wrong' });
        }
    }
);

module.exports = router;
