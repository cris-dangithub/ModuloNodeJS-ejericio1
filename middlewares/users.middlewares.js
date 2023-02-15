const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

const getId = req => {
  // Revisar si el id existe en los parámetros
  let { id } = req.params;
  // Si no existe, verificar por el body
  if (!id) {
    const { userId } = req.body;
    return userId;
  }
  return id;
};

exports.validIfUserExists = catchAsync(async (req, res, next) => {
  // Si el id no existe, quiere decir que la petición se hizo desde la ruta de repairs
  const id = getId(req);
  const user = await Users.findOne({
    where: {
      id,
      status: 'available',
    },
  });
  if (!user) {
    return next(new AppError('User has not been found', 404));
  }
  req.user = user;
  next();
});

exports.validUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findOne({
    where: {
      email,
    },
  });
  if (user && user.status === 'unavailable') {
    await user.update({ status: 'available' });
    const message =
      'The user already existed but was disabled, so the account was successfully enabled';
    return appSuccess(res, 200, message);
  }
  if (user) {
    return next(
      new AppError(
        `The user email already exists. Please try another email`,
        400
      )
    );
  }
  next();
});
