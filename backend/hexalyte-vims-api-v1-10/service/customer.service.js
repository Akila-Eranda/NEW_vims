const db = require("../models");
const Customer = db.customer;
const CustomerAddress = db.customeraddress;
const Salesorder = db.salesorder;
const Product = db.product;

// Add New Customer
const addNewCustomer = async (params) => {
  const { Name, CompanyName, Phone, Email, CustomerAddressID, Note } = params;

  const customerAddress = await CustomerAddress.findByPk(CustomerAddressID)

  if (customerAddress == null) {
    return "no customer address found"
  }

  const customer = { Name, CompanyName, Phone, Email, CustomerAddressID, isActive: true, Note };

  const newCustomerRow = await Customer.create(customer)
  return newCustomerRow

};

// Get All Customer
// const getAllCustomers = async (filter, options) => {
//   const customers = await Customer.findAll({
//     include: [{
//       model: CustomerAddress,
//       required: true
//     }]
//   });
//   return customers;
// };


const getAllCustomers = async (filter, options) => {

  const results = await sequelize.query(`
      SELECT 
        *
      FROM customers c
      INNER JOIN customeraddresses ca ON c.CustomerAddressID = ca.AddressID
    `);

    return results

};

// Get Customer By Id
const getCustomerById = async (cusId) => {
  const customer = await Customer.findOne({ where: { CustomerID: cusId } });
  return customer;
};

// Update Customer By Id
const updateCustomerById = async (cusId, updateBody) => {
  const { Name, CompanyName, Phone, Email, Note } = updateBody;

  const customer = {
    Name,
    CompanyName,
    Phone,
    Email,
    Note
  };
  const row = await Customer.update(customer, { where: { CustomerID: cusId } });
  return row
};

// Delete Customer By Id
const deleteCustomerById = async (cusId) => {
  // const row = await Customer.destroy({ where: { CustomerID: cusId } });
  // return row

  const customer = await Customer.findByPk(cusId)

  if (customer) {
    console.log(customer)
    if (customer.isActive) {
      const row = await Customer.update({ isActive: false }, { where: { CustomerID: cusId } })
      return row
    } else {
      const row = await Customer.update({ isActive: true }, { where: { CustomerID: cusId } })
      return row
    }
  } else {
    return null
  }

  // const row = await Customer.update({ isActive: false }, { where: { CustomerID: cusId } })

};

// Get Customer Order History
const getCustomerOrderHistory = async (customerId) => {
  const orders = await Salesorder.findAll({
    where: { 
      CustomerID: customerId, 
      isActive: 1 
    },
    include: [{
      model: Product,
      through: { 
        attributes: ['Quantity', 'UnitPrice'] 
      },
      attributes: ['ProductID', 'Name', 'Description', 'SellingPrice']
    }],
    order: [['OrderDate', 'DESC']],
    attributes: ['OrderID', 'OrderDate', 'TotalAmount', 'Status', 'Discount', 'PaymentStatus']
  });
  
  return orders;
};

module.exports = {
  addNewCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  getCustomerOrderHistory,
};
