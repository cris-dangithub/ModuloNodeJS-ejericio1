const { genSalt, hash } = require('bcryptjs');
const Repairs = require('../models/repairs.model');
const Users = require('../models/users.model');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');
const { generateJWT } = require('../utils/jwt');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.findAll({
    where: {
      status: 'available',
    },
    include: [{ model: Repairs }],
  });
  appSuccess(res, 200, 'Users obteined', { users });
});

/*
  A pesar de no tener necesidad de una función asincrona,
  debemos poenrla para seguir manejando algun otro error mediante
  el .catch()
*/
exports.getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;
  appSuccess(res, 200, 'User obtained successfully', { user });
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const { user } = req;
  const userUpdated = await user.update({
    name,
    email,
  });
  appSuccess(res, 200, 'User updated successfully', {
    userUpdated: {
      id: userUpdated.id,
      name: userUpdated.name,
      email: userUpdated.email,
      role: userUpdated.role,
    },
  });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  const { user } = req;
  await user.update({
    status: 'unavailable',
  });
  appSuccess(res, 200, 'User has been deleted successfully');
});
