const db = require('../models');
const Vehicle = db.vehicle;
const Driver = db.driver;

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({ include: [{ model: Driver, as: 'driver', attributes: ['DriverID', 'Name', 'Phone'] }], order: [['VehicleNumber', 'ASC']] });
    res.status(200).json({ vehicles });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ vehicle });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const updateVehicle = async (req, res) => {
  try {
    await Vehicle.update(req.body, { where: { VehicleID: req.params.id } });
    res.status(200).json({ message: 'Vehicle updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const deleteVehicle = async (req, res) => {
  try {
    await Vehicle.destroy({ where: { VehicleID: req.params.id } });
    res.status(200).json({ message: 'Vehicle deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({ order: [['Name', 'ASC']] });
    res.status(200).json({ drivers });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ driver });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const updateDriver = async (req, res) => {
  try {
    await Driver.update(req.body, { where: { DriverID: req.params.id } });
    res.status(200).json({ message: 'Driver updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const deleteDriver = async (req, res) => {
  try {
    await Driver.destroy({ where: { DriverID: req.params.id } });
    res.status(200).json({ message: 'Driver deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, getAllDrivers, createDriver, updateDriver, deleteDriver };
