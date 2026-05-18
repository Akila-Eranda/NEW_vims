const express = require('express');
const router = express.Router();
const paymentController = require('../../controller/payment.controller');
const { auth } = require('../../middleware/auth');

router.post('/', auth(), paymentController.createPayment);
router.get('/', auth(), paymentController.getAllPayments);
router.get('/order/:orderId', auth(), paymentController.getPaymentsByOrder);
router.get('/customer/:customerId', auth(), paymentController.getPaymentsByCustomer);
router.delete('/:id', auth('manageUsers'), paymentController.deletePayment);

module.exports = router;
