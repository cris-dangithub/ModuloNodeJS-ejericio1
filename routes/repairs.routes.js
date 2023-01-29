const { Router } = require('express');
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

const router = Router();

router.get('/', getAllMotorcyclePendingList);
router.get('/:id', validRepairById, getPendingMotorcycletById);
router.post('/', validIfUserExists, createAppointment);
router.patch('/:id', validRepairById, updateStatusRepair);
router.delete('/:id', validIfCanceledRepair, validRepairById, cancelRepair);

module.exports = {
  repairsRouter: router,
};
