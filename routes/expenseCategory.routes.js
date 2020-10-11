const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const expense_category_controller = require('../controllers/expenseCategory.controller');
const router = Router();

// /api/expense-category

router.post('/', auth, expense_category_controller.create);

router.get('/', auth, expense_category_controller.getAll);

module.exports = router;
