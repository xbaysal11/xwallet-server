const { Router } = require('express');
const { check } = require('express-validator');
const auth_controller = require('../controllers/auth.controller');
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
  auth_controller.register
);

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'enter valid email').normalizeEmail().isEmail(),
    check('password', 'enter password').exists(),
  ],
  auth_controller.login
);
router.post(
  '/check-secret-word',
  [
    check('email', 'enter valid email').normalizeEmail().isEmail(),
    check('secretWord', 'enter secret word').exists(),
  ],
  auth_controller.checkSecretWord
);
router.post(
  '/reset-password',
  [
    check('email', 'enter valid email').normalizeEmail().isEmail(),
    check('password', 'enter password').exists(),
  ],
  auth_controller.reset
);

router.put(
  '/:id',
  [check('password', 'can not change password').not().exists()],
  auth_controller.update
);

module.exports = router;
