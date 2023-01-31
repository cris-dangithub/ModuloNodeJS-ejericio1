const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require('../controllers/users.controllers');

const { Router } = require('express');
const {
  validIfUserExists,
  validUserByEmail,
} = require('../middlewares/users.middlewares');
const { check } = require('express-validator');
const { validFields } = require('../middlewares/validFields');

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', validIfUserExists, getUserById);
router.post(
  '/',
  [
    check('name', 'Username must be mandatory').not().isEmpty(),
    check('email', 'Email must be mandatory').not().isEmpty(),
    check('email', 'Email must have in a correct format').isEmail(),
    check('password', 'Password must be mandatory').not().isEmpty(),
    check('role', 'Role must be mandatory').not().isEmpty(),
    validFields,
  ],
  validUserByEmail,
  createUser
);
router.patch('/:id', validIfUserExists, updateUserById);
router.delete('/:id', validIfUserExists, deleteUserById);

module.exports = {
  usersRouter: router,
};
