const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
} = require('../controllers/users.controllers');

const { Router } = require('express');
const { validIfUserExists } = require('../middlewares/users.middlewares');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middleware');
const { check } = require('express-validator');
const { validFields } = require('../middlewares/validFields');

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', validIfUserExists, getUserById);

// ------ Rutas protegidas ------
router.use(protect);
router.patch(
  '/:id',
  [
    check('email', 'Email must have in a correct format').optional().isEmail(),
    check('name', 'Name must be a string').isString(),
    validFields,
    validIfUserExists,
    protectAccountOwner,
  ],
  updateUserById
);
router.delete('/:id', [validIfUserExists, protectAccountOwner], deleteUserById);

module.exports = {
  usersRouter: router,
};
