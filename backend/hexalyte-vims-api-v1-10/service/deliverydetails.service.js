const db = require("../models");
const Deleverydetails = db.deliverydetails;
const Customer = db.customer;
const CustomerAddress = db.customeraddress;
const SalesOrder = db.salesorder;

// add new delivery details
const addNewDeleveryDetails = async (params) => {
  const {
    CustomerID,
    DeliveryAddressID,
    OrderID,
    DeliveryDate,
    DeliveryTimeSlot,
    DeliveryStatus,
    TrackingNumber,
    Carrier,
    EstimatedDeliveryDate,
    ActualDeliveryDate,
    PaymentStatus
  } = params;

  const customer = await Customer.findByPk(CustomerID);
  if (customer == null) {
    return "no customer found";
  }
  const customerAddress = await CustomerAddress.findByPk(DeliveryAddressID);
  if (customerAddress == null) {
    return "no customer address found";
  }
  const salesOrder = await SalesOrder.findByPk(OrderID);
  if (salesOrder == null) {
    return "no sales order found";
  }

  const newDetails = {
    CustomerID,
    DeliveryAddressID,
    OrderID,
    DeliveryDate,
    DeliveryTimeSlot,
    DeliveryStatus,
    TrackingNumber,
    Carrier,
    EstimatedDeliveryDate,
    ActualDeliveryDate,
    PaymentStatus
  };

  const deliveryDetailsRow = await Deleverydetails.create(newDetails)
  return deliveryDetailsRow
  
};

// Get all delevery details
const getAllDeleveryDetails = async () => {
  const deleveryDetails = await Deleverydetails.findAll();
  return deleveryDetails;
};

// Get delivery detail By Id
const getDeliveryDetailsById = async (deliveryId) => {
  const deliverydetail = await Deleverydetails.findByPk(deliveryId);
  return deliverydetail;
};

// delete delevery detail by id
const deleteDeleveryDetailsById = async (deliveryId) => {
  const rows = await Deleverydetails.destroy({
    where: { DeliveryID: deliveryId },
  });
  return row;
};

// update delevery detail by id
const updateDeliveryDetailById = async (deliveryId, updateBody) => {
  const {
    CustomerID,
    DeliveryAddressID,
    OrderID,
    DeliveryDate,
    DeliveryTimeSlot,
    DeliveryStatus,
    TrackingNumber,
    Carrier,
    EstimatedDeliveryDate,
    ActualDeliveryDate,
    PaymentStatus
  } = updateBody;
  const customer = await Customer.findByPk(CustomerID);
  if (!customer) {
    return { message: "Invalid Customer ID" };
  }
  const customerAddress = await CustomerAddress.findByPk(DeliveryAddressID);
  if (!customerAddress) {
    return { message: "Invalid Delivery address Id." };
  }
  const salesOrder = await SalesOrder.findByPk(OrderID);
  if (salesOrder == null) {
    return { message: "Invalid Order address Id." };

  }
  const updatedDeliveryDetails = {
    CustomerID,
    DeliveryAddressID,
    OrderID,
    DeliveryDate,
    DeliveryTimeSlot,
    DeliveryStatus,
    TrackingNumber,
    Carrier,
    EstimatedDeliveryDate,
    ActualDeliveryDate,
    PaymentStatus
  };

  const row = await Deleverydetails.update(updateBody, {
    where: { DeliveryID: deliveryId },
  });

  return row;
};

module.exports = {
  addNewDeleveryDetails,
  getAllDeleveryDetails,
  updateDeliveryDetailById,
  deleteDeleveryDetailsById,
  getDeliveryDetailsById,


};
