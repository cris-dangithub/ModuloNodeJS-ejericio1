const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser } = require('../controllers/auth.controller');
const { validUserByEmail } = require('../middlewares/users.middlewares');
const { validFields } = require('../middlewares/validFields');

const router = Router();

// Ruta para crear usuario
router.post(
  '/',
  [
    check('name', 'Username must be mandatory').not().isEmpty(),
    check('name', 'Username must be a string').isString(),
    check('email', 'Email must be mandatory').not().isEmpty(),
    check('email', 'Email must have in a correct format').isEmail(),
    check('password', 'Password must be mandatory').not().isEmpty(),
    check('password', 'Password must be a string').isString(),
    check('role', 'Role must be mandatory').not().isEmpty(),
    check('role', 'Role must be mandatory').isString(),
    validFields,
  ],
  validUserByEmail,
  createUser
);

// Ruta para logear
router.post(
  '/login',
  [
    check('email', 'Email must be mandatory').not().isEmpty(),
    check('email', 'Email must have in a correct format').isEmail(),
    check('password', 'Password must be mandatory').not().isEmpty(),
    check('password', 'Password must be a string').isString(),
    validFields,
  ],
  loginUser
);

module.exports = {
  authRouter: router,
};
