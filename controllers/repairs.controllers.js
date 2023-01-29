const Repairs = require('../models/repairs.model');
const Users = require('../models/users.model');

exports.getAllMotorcyclePendingList = async (req, res) => {
  try {
    const repairs = await Repairs.findAll({
      where: {
        status: 'pending',
      },
    });
    res.status(200).json({
      status: 'success',
      message: 'ROUTER - GET',
      repairs,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.getPendingMotorcycletById = async (req, res) => {
  try {
    const { repair } = req;
    res.json({
      status: 'success',
      message: 'ROUTER - GET BY ID',
      repair,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { date, userId } = req.body;
    const user = await Users.findOne({
      where: {
        id: userId,
        status: 'available',
      },
    });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User has not been found',
      });
    }
    const newRepair = await Repairs.create({
      date,
      userId,
    });
    res.status(201).json({
      status: 'success',
      message: `The appointment has been created successfully by ${user.name}`,
      newRepair,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.updateStatusRepair = async (req, res) => {
  try {
    const { repair } = req;
    const updatedRepair = await repair.update({ status: 'completed' });
    res.json({
      status: 'success',
      message: 'The repair has been completed successfully',
      updatedRepair,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.cancelRepair = async (req, res) => {
  try {
    const { repair } = req;
    await repair.update({ status: 'cancelled' });
    res.json({
      status: 'success',
      message: 'The repair has been cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};
