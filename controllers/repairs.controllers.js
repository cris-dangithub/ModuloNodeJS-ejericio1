const Repairs = require('../models/repairs.model');
const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

exports.getAllMotorcyclePendingList = catchAsync(async (req, res, next) => {
  const repairs = await Repairs.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
    where: {
      status: 'pending',
    },
    include: [
      {
        model: Users,
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
      },
    ],
  });
  appSuccess(res, 200, 'Repairs obtained', { repairs });
});

exports.getPendingMotorcycletById = catchAsync(async (req, res, next) => {
  const { repair } = req;
  appSuccess(res, 200, 'Repair obtained successfully', { repair });
});

exports.createAppointment = catchAsync(async (req, res, next) => {
  const { date, userId, motorsNumber, description } = req.body;
  const { user } = req;
  const newRepair = await Repairs.create({
    date,
    userId,
    motorsNumber,
    description,
  });
  const message = `The appointment has been created successfully by ${user.name}`;
  appSuccess(res, 201, message, { newRepair });
});

exports.updateStatusRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;
  const updatedRepair = await repair.update({ status: 'completed' });
  const message = 'The repair has been completed successfully';
  appSuccess(res, 200, message, updatedRepair);
});

exports.cancelRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;
  await repair.update({ status: 'cancelled' });
  const message = 'The repair has been cancelled successfully';
  appSuccess(res, 200, message);
});
