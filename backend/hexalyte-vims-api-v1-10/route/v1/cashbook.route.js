const express = require('express');
const router = express.Router();
const cashbookController = require('../../controller/cashbook.controller');
const { auth } = require('../../middleware/auth');

router.get('/', auth('getUsers'), cashbookController.getAllEntries);
router.get('/daily-collection', auth('getUsers'), cashbookController.getDailyCollection);
router.post('/', auth('manageUsers'), cashbookController.createEntry);
router.put('/:id', auth('manageUsers'), cashbookController.updateEntry);
router.delete('/:id', auth('manageUsers'), cashbookController.deleteEntry);

module.exports = router;
