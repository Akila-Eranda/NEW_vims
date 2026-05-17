const db = require("../models");
const Category = db.category;
const categoryServices = require("../service/category.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const addCategory = catchAsync(async (req, res) => {
  const newCategory = await categoryServices.addNewCategory(req.body);
  res.send({ newCategory });
});

const getAllCategory = catchAsync(async (req, res) => {
  const allCategory = await Category.findAll();
  if (allCategory.length == 0) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Categories Found",
    });
  }
  return res.status(httpStatus.OK).send({ allCategory });
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryServices.getCategoryById(req.params.id);
  if (!category) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Category Found",
    });
  }
  return res.status(httpStatus.OK).send({ category });
});

const updateCategoryById = catchAsync(async (req, res) => {
  const updatedCategory = await categoryServices.updateCategoryById(
    req.params.id,
    req.body
  );
  if (!updatedCategory) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Category Found",
    });
  }
  return res.status(httpStatus.OK).send({ updatedCategory });
});

const deleteCategoryById = catchAsync(async (req, res) => {
  const deletedCategory = await categoryServices.deleteCategoryById(
    req.params.id
  );
  if (!deletedCategory) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: "No Category Found",
    });
  }
  return res.status(httpStatus.OK).send({ deletedCategory });
});

module.exports = {
  addCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
