const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const income_category_controller = require('../controllers/incomeCategory.controller');
const router = Router();

// /api/income-category

router.post('/', auth, income_category_controller.create);

router.get('/', auth, income_category_controller.getAll);

module.exports = router;
