const express = require("express");
const router = express.Router();
const categoryController = require("../../controller/category.controller");
const {auth} = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const categoryValidation = require('../../validations/category.validation');

router
  .route('/')
  .get(auth(), categoryController.getAllCategory)
  .post(auth(), validate(categoryValidation.addCategory),categoryController.addCategory);

router
  .route("/:id")
  .get(auth(), validate(categoryValidation.getCategoryById),categoryController.getCategoryById)
  .put(auth(), validate(categoryValidation.updateCategoryById),categoryController.updateCategoryById)
  .delete(auth(), validate(categoryValidation.deleteCategoryById),categoryController.deleteCategoryById);

module.exports = router;
