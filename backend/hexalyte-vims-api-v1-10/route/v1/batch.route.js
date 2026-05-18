const express = require('express');
const router = express.Router();
const batchController = require('../../controller/batch.controller');
const { auth } = require('../../middleware/auth');

router.get('/expiring', auth('getUsers'), batchController.getExpiringBatches);
router.get('/product/:productId', auth('getUsers'), batchController.getBatchesByProduct);
router.post('/', auth('manageUsers'), batchController.createBatch);
router.put('/:id', auth('manageUsers'), batchController.updateBatch);
router.delete('/:id', auth('manageUsers'), batchController.deleteBatch);

module.exports = router;
