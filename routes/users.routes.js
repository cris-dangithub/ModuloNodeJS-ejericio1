const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require('../controllers/users.controllers');

const { Router } = require('express');
const { validIfUserExists, validUserByEmail } = require('../middlewares/users.middlewares');

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', validIfUserExists, getUserById);
router.post('/', validUserByEmail, createUser);
router.patch('/:id', validIfUserExists, updateUserById);
router.delete('/:id', validIfUserExists, deleteUserById);

module.exports = {
  usersRouter: router,
};
