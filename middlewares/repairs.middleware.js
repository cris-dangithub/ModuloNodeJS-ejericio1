const Repairs = require('../models/repairs.model');
const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.validRepairById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const repair = await Repairs.findOne({
    attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
    where: {
      id,
      status: 'pending',
    },
    include: [
      {
        model: Users,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
    ],
  });
  if (!repair) {
    return next(new AppError('Repair has not been found', 404));
  }
  req.repair = repair;
  next();
});

exports.validIfCanceledRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const repair = await Repairs.findOne({
    where: {
      id,
      status: 'completed',
    },
  });
  if (repair) {
    return next(new AppError('The repair is now complete', 400));
  }
  next();
});
