const Users = require('../models/users.model');

exports.validIfUserExists = async (req, res, next) => {
  try {
    // Si el id no existe, quiere decir que la petición se hizo desde la ruta de repairs
    let { id } = req.params;
    const { userId } = req.body;
    if (!id) id = userId;
    // ---------------------
    const user = await Users.findOne({
      where: {
        id,
        status: 'available',
      },
    });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User has not been found',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.validUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({
      where: {
        email,
      },
    });
    if (user && user.status === 'unavailable') {
      await user.update({ status: 'available' });
      return res.status(200).json({
        status: 'success',
        message:
          'The user already existed but was disabled, so the account was successfully enabled',
      });
    }
    if (user) {
      return res.status(400).json({
        status: 'error',
        message: `The user email already exists. Please try another email.`,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};
