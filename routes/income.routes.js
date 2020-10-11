const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const income_controller = require('../controllers/income.controller');
const router = Router();

// /api/income

router.post('/', auth, income_controller.create);

router.get('/', auth, income_controller.getAll);

module.exports = router;
