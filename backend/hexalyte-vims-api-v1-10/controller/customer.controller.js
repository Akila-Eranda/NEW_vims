const db = require("../models");
const Customer = db.customer;
const customerServices = require("../service/customer.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const addCustomer = catchAsync(async (req, res) => {
  const newCustomer = await customerServices.addNewCustomer(req.body);
  if (newCustomer == "no customer address found") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Customer Address ID. Customer Address ID does not exists`
    })
  }
  return res.status(httpStatus.OK).send({newCustomer})
});

const getAllCustomers = catchAsync(async (req, res) => {
  const allCustomers = await Customer.findAll();
  if (allCustomers.length == 0) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Customers Found",
    });
  }
  return res.status(httpStatus.OK).send({ allCustomers });
});

const getCustomerById = catchAsync(async (req, res) => {
  const customer = await customerServices.getCustomerById(req.params.id);
  if (!customer) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Customer Found",
    });
  }
  return res.status(httpStatus.OK).send({ customer });
});

const updateCustomerById = catchAsync(async (req, res) => {
  const updatedCustomer = await customerServices.updateCustomerById(
    req.params.id,
    req.body
  );
  if (!updatedCustomer) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Customer Found",
    });
  }

  if (updatedCustomer == "no customer address found") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Customer Address ID. Customer Address ID does not exists`
    })
  }
  return res.status(httpStatus.OK).send({ updatedCustomer });
});

const deleteCustomerById = catchAsync(async (req, res) => {
  const deletedCustomer = await customerServices.deleteCustomerById(
    req.params.id
  );
  if (!deletedCustomer) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Customer Found",
    });
  }
  return res.status(httpStatus.OK).send({ deletedCustomer });
});

const getCustomerOrderHistory = catchAsync(async (req, res) => {
  const orderHistory = await customerServices.getCustomerOrderHistory(req.params.id);
  return res.status(httpStatus.OK).send({ orderHistory });
});

module.exports = {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  getCustomerOrderHistory,
};
