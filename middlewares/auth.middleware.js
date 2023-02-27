const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { promisify } = require('util');
const { verify } = require('jsonwebtoken');
const Users = require('../models/users.model');

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  // Verificar que el token venga en un formato correcto
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // Verificar y decodificar el token (si no ha expirado)
  const decoded = await promisify(verify)(token, process.env.SECRET_JWT_SEED);

  // Chekear que el usuario exista
  const user = await Users.findOne({
    where: {
      id: decoded.id,
      status: 'available',
    },
  });
  if (!user) {
    return next(
      new AppError('The owner of this token is not longer available', 401)
    );
  }

  // Adjuntar el usuario en sesión
  req.sessionUser = user;
  next();
});

// Protege al dueño del token
exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  // Obtener el usuario que viene de la request
  const { user, sessionUser } = req;
  // Validar que el usuario en sesion sea el usuario que está haciendo la petición
  if (user.id !== sessionUser.id && sessionUser.role !== 'superadmin') {
    return next(new AppError('You are not the owner of this account', 401));
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const { sessionUser } = req;
    // 1. Comprar los roles con el rol del usuario en sesión (el que viene del token)
    if (!roles.includes(sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
