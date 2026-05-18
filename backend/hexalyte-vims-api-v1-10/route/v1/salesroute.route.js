const express = require('express');
const router = express.Router();
const salesRouteController = require('../../controller/salesroute.controller');
const { auth } = require('../../middleware/auth');

router.get('/', auth(), salesRouteController.getAllRoutes);
router.post('/', auth(), salesRouteController.createRoute);
router.get('/:id', auth(), salesRouteController.getRouteById);
router.put('/:id', auth(), salesRouteController.updateRoute);
router.delete('/:id', auth('manageUsers'), salesRouteController.deleteRoute);
router.post('/:id/assign-customers', auth(), salesRouteController.assignCustomersToRoute);

module.exports = router;
