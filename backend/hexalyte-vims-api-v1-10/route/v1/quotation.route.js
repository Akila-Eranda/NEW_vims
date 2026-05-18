const express = require('express');
const router = express.Router();
const quotationController = require('../../controller/quotation.controller');
const { auth } = require('../../middleware/auth');

router.get('/', auth('getUsers'), quotationController.getAllQuotations);
router.get('/:id', auth('getUsers'), quotationController.getQuotationById);
router.post('/', auth('manageUsers'), quotationController.createQuotation);
router.patch('/:id/status', auth('manageUsers'), quotationController.updateQuotationStatus);
router.delete('/:id', auth('manageUsers'), quotationController.deleteQuotation);

module.exports = router;
