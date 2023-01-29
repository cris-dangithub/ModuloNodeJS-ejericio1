const Users = require('../models/users.model');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: {
        status: 'available',
      },
    });
    res.status(200).json({
      status: 'success',
      message: 'ROUTE - GET',
      users,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json({
      status: 'success',
      message: 'ROUTE - GET BY ID',
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Crear usuario
    const newUser = await Users.create({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: role.toLowerCase(),
    });
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { user } = req;
    const userUpdated = await user.update({
      name,
      email,
    });
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      userUpdated,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { user } = req;
    await user.update({
      status: 'unavailable',
    });
    res.status(200).json({
      status: 'success',
      message: 'User has been deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};
