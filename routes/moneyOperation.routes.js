const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const money_operation_controller = require('../controllers/moneyOperation.controller');
const router = Router();

// /api/money-operation

router.post('/', auth, money_operation_controller.create);

router.get('/', auth, money_operation_controller.getAll);

router.get('/:id', auth, money_operation_controller.getById);

router.put('/:id', auth, money_operation_controller.update);

router.delete('/:id', auth, money_operation_controller.delete);

module.exports = router;
