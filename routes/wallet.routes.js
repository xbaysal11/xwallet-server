const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const wallet_controller = require('../controllers/wallet.controller');
const router = Router();

// /api/wallet

router.post('/', auth, wallet_controller.create);

router.get('/', auth, wallet_controller.getAll);

router.get('/:id', auth, wallet_controller.getById);

router.put('/:id', auth, wallet_controller.update);

router.delete('/:id', auth, wallet_controller.delete);


module.exports = router;
