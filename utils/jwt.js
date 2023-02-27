const { sign } = require('jsonwebtoken');

exports.generateJWT = id => {
  return new Promise((resolve, reject) => {
    // Creación del payload
    const payload = { id };
    // Firma y generación del token
    sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};
