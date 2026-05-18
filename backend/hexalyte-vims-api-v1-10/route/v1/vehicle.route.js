const express = require('express');
const router = express.Router();
const vehicleController = require('../../controller/vehicle.controller');
const { auth } = require('../../middleware/auth');

router.get('/vehicles', auth('getUsers'), vehicleController.getAllVehicles);
router.post('/vehicles', auth('manageUsers'), vehicleController.createVehicle);
router.put('/vehicles/:id', auth('manageUsers'), vehicleController.updateVehicle);
router.delete('/vehicles/:id', auth('manageUsers'), vehicleController.deleteVehicle);

router.get('/drivers', auth('getUsers'), vehicleController.getAllDrivers);
router.post('/drivers', auth('manageUsers'), vehicleController.createDriver);
router.put('/drivers/:id', auth('manageUsers'), vehicleController.updateDriver);
router.delete('/drivers/:id', auth('manageUsers'), vehicleController.deleteDriver);

module.exports = router;
