const db = require("../models");
const CustomerAddress = db.customeraddress;
const Customer = db.customer;

// Add new CustomerAddress
const addNewCustomerAddress = async (params) => {
  const {
    AddressType,
    Street,
    City,
    State,
    PostalCode,
    Country,
    IsDefault,
  } = params;

  const newAddress = {
    AddressType,
    Street,
    City,
    State,
    PostalCode,
    Country,
    IsDefault,
  };

  const newAddressRow = await CustomerAddress.create(newAddress)
  return newAddressRow
};
// Get all CustomerAddress
const getAllCustomerAdress = async (filter, options) => {
  const customerAddresses = await CustomerAddress.findAll();
  return customerAddresses;
};

// Get CustomerAddress By Id
const getCustomerAddressById = async (addressId) => {
  const customerAddress = await CustomerAddress.findByPk(addressId);
  return customerAddress;
};

// Delete CustomerAddress By Id
const deleteCustomerAddressById = async (addressId) => {
  const row = await CustomerAddress.destroy({
    where: { AddressID: addressId },
  });
  return { message: "Customer address successfully deleted" };
};

// update customer address by id
const updateCustomerAddressById = async (addressId, updateBody) => {
  const {
    AddressType,
    Street,
    City,
    State,
    PostalCode,
    Country,
    IsDefault,
  } = updateBody;

  const updatedAddress = {
    AddressType,
    Street,
    City,
    State,
    PostalCode,
    Country,
    IsDefault,
  };
  const row = await CustomerAddress.update(updatedAddress, {
    where: { AddressID: addressId },
  });
  return row;
};

module.exports = {
  addNewCustomerAddress,
  updateCustomerAddressById,
  getAllCustomerAdress,
  deleteCustomerAddressById,
  getCustomerAddressById,
};
