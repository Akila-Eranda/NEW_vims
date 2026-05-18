const db = require('../models');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const SalesRoute = db.salesroute;
const Customer = db.customer;
const User = db.user;

const createRoute = catchAsync(async (req, res) => {
  const route = await SalesRoute.create(req.body);
  res.status(httpStatus.CREATED).json({ route });
});

const getAllRoutes = catchAsync(async (req, res) => {
  const routes = await SalesRoute.findAll({
    where: { isActive: true },
    include: [
      { model: User, as: 'salesRep', attributes: ['id', 'firstname', 'lastname', 'email'] },
      { model: Customer, as: 'customers', attributes: ['CustomerID', 'Name', 'CompanyName', 'Phone'] }
    ],
    order: [['RouteName', 'ASC']]
  });
  res.json({ routes });
});

const getRouteById = catchAsync(async (req, res) => {
  const route = await SalesRoute.findByPk(req.params.id, {
    include: [
      { model: User, as: 'salesRep', attributes: ['id', 'firstname', 'lastname', 'email'] },
      { model: Customer, as: 'customers', attributes: ['CustomerID', 'Name', 'CompanyName', 'Phone', 'CustomerType'] }
    ]
  });
  if (!route) return res.status(httpStatus.NOT_FOUND).json({ message: 'Route not found' });
  res.json({ route });
});

const updateRoute = catchAsync(async (req, res) => {
  const [updated] = await SalesRoute.update(req.body, { where: { RouteID: req.params.id } });
  if (!updated) return res.status(httpStatus.NOT_FOUND).json({ message: 'Route not found' });
  const route = await SalesRoute.findByPk(req.params.id);
  res.json({ route });
});

const deleteRoute = catchAsync(async (req, res) => {
  await SalesRoute.update({ isActive: false }, { where: { RouteID: req.params.id } });
  res.status(httpStatus.NO_CONTENT).send();
});

const assignCustomersToRoute = catchAsync(async (req, res) => {
  const { customerIds } = req.body;
  await Customer.update({ RouteID: req.params.id }, { where: { CustomerID: customerIds } });
  res.json({ message: 'Customers assigned to route' });
});

module.exports = { createRoute, getAllRoutes, getRouteById, updateRoute, deleteRoute, assignCustomersToRoute };
