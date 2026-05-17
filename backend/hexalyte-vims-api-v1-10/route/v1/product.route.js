const express = require('express');
const router = express.Router();
const productController = require('../../controller/product.controller'); 
const validate = require('../../middleware/validate');
const productValidation = require('../../validations/product.validation');
const {auth} = require('../../middleware/auth');

router
  .route('/')
  .post(auth(), validate(productValidation.createProduct), productController.addProduct)
  .get(auth(), validate(productValidation.getProducts), productController.getAllProducts);

router
  .route('/:id')
  .get(auth(), validate(productValidation.getProductById), productController.getProductByID)
  .put(auth(), productController.updateProductById)
  .delete(auth(), validate(productValidation.deleteProduct), productController.deleteProductById);

router
  .route('/q/:id')
  .put(auth(), productController.updateProductQuantityById)

module.exports = router;
