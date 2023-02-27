const { genSalt, hash, compare } = require('bcryptjs');
const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');
const { generateJWT } = require('../utils/jwt');

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role = 'client' } = req.body;

  // Encriptación de contraseña
  const salt = await genSalt(10);
  const encryptedPassword = await hash(password, salt);

  // Crear usuario
  const newUser = await Users.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role: role.toLowerCase(),
  });

  // Generar un JWT
  const token = await generateJWT(newUser.id);

  // Mandar respuesta al cliente
  appSuccess(res, 201, 'User created successfully', {
    newUser: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log('first');
  // Verificar que la existencia del usuario y la contraseña sean las correctas
  const user = await Users.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError(`User not found`, 404));
  }

  // Comparar la contraseña con la encriptada
  if (!(await compare(password, user.password))) {
    return next(new AppError(`Incorrect email or password`, 401));
  }

  // Generar token
  const token = await generateJWT(user.id);

  // Mandar respuesta al cliente
  appSuccess(res, 200, `Logged successfully`, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});
