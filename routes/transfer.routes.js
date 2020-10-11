const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const transfer_controller = require('../controllers/transfer.controller');
const router = Router();

// /api/transfer

router.post('/', auth, transfer_controller.create);

router.get('/', auth, transfer_controller.getAll);

module.exports = router;
