const db = require("../models");
const Deliverydetails = db.deliverydetails;
const deliveryDetailsServices = require("../service/deliverydetails.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const getDeliveryDetails = catchAsync(async (req, res) => {

  try {
    const allDeliveryDetails = await Deliverydetails.findAll();
    if (allDeliveryDetails.length == 0) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: "No Delivery Details Found",
      });
    }
    return res.status(httpStatus.OK).send({ allDeliveryDetails });
  } catch (error) {
    console.log(error)
  }

});

const getDeliveryDetailsById = catchAsync(async (req, res) => {
  const deliveryDetail = await deliveryDetailsServices.getDeliveryDetailsById(
    req.params.id
  );
  if (!deliveryDetail) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: `No Delivery detail Found with ID:${req.params.id}`,
    });
  }
  return res.status(httpStatus.OK).send({ deliveryDetail });
});

const addDeliveryDetails = catchAsync(async (req, res) => {
  const deliveryDetails = await deliveryDetailsServices.addNewDeleveryDetails(
    req.body
  );
  if (deliveryDetails == "no customer found") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Customer ID. Customer ID does not exists`,
    });
  }
  if (deliveryDetails == "no customer address found") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Delivery Address. Delivery Address does not exists`,
    });
  }
  if (deliveryDetails == "no sales order found") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Order. Sales Order does not exists`,
    });
  }
  return res.status(httpStatus.OK).send({ deliveryDetails });
});

const deleteDeliveryDetailsById = catchAsync(async (req, res) => {
  const deletedDeliveryDetails =
    await deliveryDetailsServices.deleteDeleveryDetailsById(req.params.id);
  if (deletedDeliveryDetails == 0) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Customer Address ID.`,
    });
  }
  return res.status(httpStatus.OK).send({ deletedDeliveryDetails });
});

const updateDeliveryDetailsById = catchAsync(async (req, res) => {
  const updatedDetails =
    await deliveryDetailsServices.updateDeliveryDetailById(
      req.params.id,
      req.body
    );

  if (!updatedDetails) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Delivery Address Found",
    });
  }
  if (updatedDetails == "Invalid Customer ID.") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `"Invalid Customer ID. Customer not found"`,
    });
  } else if (updatedDetails == "Invalid Delivery address Id.") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Delivery address. Delivery address not found`,
    });
  } else if (updatedDetails == "Invalid Order address Id.") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Sales Order. Sales Order not found`,
    });
  }
  return res.status(httpStatus.OK).send({ updatedDetails });
});

module.exports = {
  addDeliveryDetails,
  getDeliveryDetails,
  getDeliveryDetailsById,
  deleteDeliveryDetailsById,
  updateDeliveryDetailsById,
};
