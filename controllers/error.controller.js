const AppError = require('../utils/appError');

// Manejo de errores falsos de servidor
const handle500FalseErrors = (err, statusCode) => {
  return new AppError(err.message, statusCode);
};

// Esta función me envía al cliente el error en ambiente de desarrollo
const sendErrorDev = (err, res) => {
  const { statusCode, status, message, stack } = err;
  res.status(statusCode).json({
    status,
    message,
    error: err,
    stack,
  });
};

// Esta función me envía al cliente el error en ambiente de producción
const sendErrorProd = (err, res) => {
  const { isOperational, statusCode, status, message } = err;
  // Validar tipo de error ("operacional" o de "programación")
  if (isOperational) {
    // Operacional -> errores con código de estado 4XX (culpa del Front)
    res.status(statusCode).json({
      status,
      message,
      ...err.extraInfo,
    });
  } else {
    // De programación -> errores código de estado 5XX (culpa del Back)
    res.status(statusCode).json({
      status,
      message: 'Internal Server Error',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  // Asignación de los estados en caso de que el error venga
  // desde el AppError o desde el carchAsync
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  // Validación de entorno de ejecución
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    // Validar los errores que no han sido validados por el catchAsync...
    // ...aquellos que puede que tengan un error 4XX y no 500
    if (err.parent?.code === '22P02') err = handle500FalseErrors(err, 400);
    // Formato de fecha inválida
    if (err.parent?.code === '22007') err = handle500FalseErrors(err, 400);
    // Lo mas probbable es que el token fue malobrado
    if (err.name === 'JsonWebTokenError') err = handle500FalseErrors(err, 401);
    // El token expiró
    if (err.name === 'TokenExpiredError') {
      const objMessage = { message: 'Token expired, please login again' };
      err = handle500FalseErrors(objMessage, 401);
    }

    sendErrorProd(err, res);
  }
};

module.exports = { globalErrorHandler };
