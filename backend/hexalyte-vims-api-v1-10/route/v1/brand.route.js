const express = require('express');
const router = express.Router();
const brandController = require('../../controller/brand.controller');
const { auth } = require('../../middleware/auth');

router.get('/', auth('getUsers'), brandController.getAllBrands);
router.post('/', auth('manageUsers'), brandController.createBrand);
router.put('/:id', auth('manageUsers'), brandController.updateBrand);
router.delete('/:id', auth('manageUsers'), brandController.deleteBrand);

module.exports = router;
