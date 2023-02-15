const { Router } = require('express');
const { check } = require('express-validator');
const {
  getAllMotorcyclePendingList,
  getPendingMotorcycletById,
  createAppointment,
  updateStatusRepair,
  cancelRepair,
} = require('../controllers/repairs.controllers');
const {
  validRepairById,
  validIfCanceledRepair,
} = require('../middlewares/repairs.middleware');
const { validIfUserExists } = require('../middlewares/users.middlewares');
const { validFields } = require('../middlewares/validFields');

const router = Router();

router.get('/', getAllMotorcyclePendingList);
router.get('/:id', validRepairById, getPendingMotorcycletById);
router.post(
  '/',
  [
    check('date', 'Date must be mandatory').not().isEmpty(),
    check('userId', 'UserID must be mandatory').not().isEmpty(),
    check('userId', 'UserID must be a number').isNumeric(),
    check('motorsNumber', 'motorsNumber must be mandatory').not().isEmpty(),
    check('motorsNumber', 'motorsNumber must be ').isNumeric(),
    check('description', 'Description must be mandatory').not().isEmpty(),
    check('description', 'Description must be a string').isString(),
    validFields,
    validIfUserExists, // Este middleware viene de los middelwares de usuarios
  ],
  createAppointment
);
router.patch('/:id', validRepairById, updateStatusRepair);
router.delete('/:id', validIfCanceledRepair, validRepairById, cancelRepair);

module.exports = {
  repairsRouter: router,
};
