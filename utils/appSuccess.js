// Globalización de los estados de petición HTTP exitosos
/* 
  Esta funcion debe están dentro de un catchAsync o dentro de algo
  que haga disposicion de los errores (trycatch o .catch())
*/
exports.appSuccess = (res, statusCode, message, extras = {}) => {
  // Control de parámetros
  const conditional1 = typeof message === 'string' || message === undefined;
  const conditional2 = !Array.isArray(extras) && typeof extras === 'object';
  const conditional3 = typeof statusCode === 'number';
  if (conditional1 && conditional2 && conditional3) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      ...extras,
    });
  }
  throw new Error(
    `You have sent the arguments of the function 'appSuccess' wrong`
  );
};
