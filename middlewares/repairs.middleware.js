const Repairs = require('../models/repairs.model');

exports.validRepairById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repair = await Repairs.findOne({
      where: {
        id,
        status: 'pending',
      },
    });
    if (!repair) {
      return res.status(404).json({
        status: 'error',
        message: 'Repair has not been found',
      });
    }
    req.repair = repair;
    next();
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.validIfCanceledRepair = async (req, res, next) => {
  try {
    const { id } = req.params;
    const repair = await Repairs.findOne({
      where: {
        id,
        status: 'completed',
      },
    });
    if (repair) {
      return res.status(400).json({
        status: 'error',
        message: 'The repair is now complete.',
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

