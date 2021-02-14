const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const category_controller = require('../controllers/category.controller');
const router = Router();

// /api/category

router.post('/', auth, category_controller.create);

router.get('/', auth, category_controller.getAll);

router.get('/:id', auth, category_controller.getById);

router.put('/:id', auth, category_controller.update);

router.delete('/:id', auth, category_controller.delete);

module.exports = router;
