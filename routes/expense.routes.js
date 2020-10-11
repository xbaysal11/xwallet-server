const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const expense_controller = require('../controllers/expense.controller');
const router = Router();

// /api/expense

router.post('/', auth, expense_controller.create);

router.get('/', auth, expense_controller.getAll);

module.exports = router;
