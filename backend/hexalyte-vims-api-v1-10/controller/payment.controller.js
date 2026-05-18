const db = require('../models');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');

const Payment = db.payment;
const SalesOrder = db.salesorder;
const Customer = db.customer;

const createPayment = catchAsync(async (req, res) => {
  const { OrderID, CustomerID, Amount, PaymentMode, PaymentDate, Reference, Notes } = req.body;

  const order = await SalesOrder.findByPk(OrderID);
  if (!order) return res.status(httpStatus.NOT_FOUND).json({ message: 'Order not found' });

  const payment = await Payment.create({
    OrderID, CustomerID: CustomerID || order.CustomerID,
    Amount, PaymentMode, PaymentDate: PaymentDate || new Date(),
    Reference, Notes, CollectedBy: req.user?.id
  });

  const totalPaid = await Payment.sum('Amount', { where: { OrderID } });
  await SalesOrder.update(
    { PaidAmount: totalPaid, PaymentStatus: totalPaid >= order.TotalAmount ? 'PAID' : 'UNPAID' },
    { where: { OrderID } }
  );

  res.status(httpStatus.CREATED).json({ message: 'Payment recorded', payment });
});

const getPaymentsByOrder = catchAsync(async (req, res) => {
  const payments = await Payment.findAll({
    where: { OrderID: req.params.orderId },
    include: [{ model: db.user, as: 'collectedBy', attributes: ['id', 'firstname', 'lastname'] }],
    order: [['PaymentDate', 'DESC']]
  });
  res.json({ payments });
});

const getPaymentsByCustomer = catchAsync(async (req, res) => {
  const payments = await Payment.findAll({
    where: { CustomerID: req.params.customerId },
    include: [
      { model: db.salesorder, as: 'order', attributes: ['OrderID', 'TotalAmount', 'OrderDate'] },
      { model: db.user, as: 'collectedBy', attributes: ['id', 'firstname', 'lastname'] }
    ],
    order: [['PaymentDate', 'DESC']]
  });
  res.json({ payments });
});

const getAllPayments = catchAsync(async (req, res) => {
  const { startDate, endDate, PaymentMode } = req.query;
  const where = {};
  if (startDate && endDate) where.PaymentDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
  if (PaymentMode) where.PaymentMode = PaymentMode;

  const payments = await Payment.findAll({
    where,
    include: [
      { model: db.customer, as: 'customer', attributes: ['CustomerID', 'Name', 'CompanyName'] },
      { model: db.salesorder, as: 'order', attributes: ['OrderID', 'TotalAmount', 'PaidAmount'] },
      { model: db.user, as: 'collectedBy', attributes: ['id', 'firstname', 'lastname'] }
    ],
    order: [['PaymentDate', 'DESC']]
  });
  res.json({ payments });
});

const deletePayment = catchAsync(async (req, res) => {
  const payment = await Payment.findByPk(req.params.id);
  if (!payment) return res.status(httpStatus.NOT_FOUND).json({ message: 'Payment not found' });

  const { OrderID, Amount } = payment;
  await payment.destroy();

  const totalPaid = (await Payment.sum('Amount', { where: { OrderID } })) || 0;
  const order = await SalesOrder.findByPk(OrderID);
  if (order) {
    await SalesOrder.update(
      { PaidAmount: totalPaid, PaymentStatus: totalPaid >= order.TotalAmount ? 'PAID' : 'UNPAID' },
      { where: { OrderID } }
    );
  }
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = { createPayment, getPaymentsByOrder, getPaymentsByCustomer, getAllPayments, deletePayment };
