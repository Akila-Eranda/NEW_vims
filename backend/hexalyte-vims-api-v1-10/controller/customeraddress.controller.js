const db = require("../models");
const CustomerAddress = db.customeraddress;
const customerAddressServices = require("../service/customeraddress.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const getAllCustomerAdress = catchAsync(async (req, res) => {
  const allcustomerAddresses = await CustomerAddress.findAll();
  if (allcustomerAddresses.length == 0) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Customer Addresses Found",
    });
  }
  return res.status(httpStatus.OK).send({ allcustomerAddresses });
});

const getCustomerAddressById = catchAsync(async (req, res) => {
  const customerAddress = await customerAddressServices.getCustomerAddressById(
    req.params.id
  );
  if (!customerAddress) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: `No Customer Address Found with ID:${req.params.id}`,
    });
  }
  return res.status(httpStatus.OK).send({ customerAddress });
});

const addCustomerAddress = catchAsync(async (req, res) => {
  const newAddress = await customerAddressServices.addNewCustomerAddress(
    req.body
  );
  return res.status(httpStatus.OK).send({ newAddress });
});

const updateCustomerAddressById = catchAsync(async (req, res) => {
  const updatedAddress =
    await customerAddressServices.updateCustomerAddressById(
      req.params.id,
      req.body
    );
  if (!updatedAddress) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Customer Address Found",
    });
  }
  if (updatedAddress == 0) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Customer Address ID.`,
    });
  }
  return res.status(httpStatus.OK).send({ updatedAddress });
});

const deleteAddressById = catchAsync(async (req, res) => {
  const deletedCustomerAddress =
    await customerAddressServices.deleteCustomerAddressById(req.params.id);
  if (deletedCustomerAddress == 0) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Customer Address ID.`,
    });
  }
  return res.status(httpStatus.OK).send({ deletedCustomerAddress });
});

module.exports = {
  addCustomerAddress,
  getAllCustomerAdress,
  getCustomerAddressById,
  deleteAddressById,
  updateCustomerAddressById,
};
