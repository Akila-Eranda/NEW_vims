const express = require("express");
const router = express.Router();
const productstorageController = require("../../controller/productstorage.controller");
const validate = require("../../middleware/validate");
const productstorageValidation = require("../../validations/productstorage.validation");
const { auth } = require("../../middleware/auth");

router
  .route("/")
  .get(auth(), productstorageController.getAllProductStorages)
  .post(
    auth(),
    validate(productstorageValidation.addNewProductStorage),
    productstorageController.addNewProductStorage
  );

router
  .route("/:id")
  .get(auth(), productstorageController.getProductStorageByProductID)
  .put(
    auth(),
    validate(productstorageValidation.updateProductStorageByProductID),
    productstorageController.updateProductStorageByProductID
  );

router
  .route("/:productId/:locationId")
  .get(auth(), productstorageController.getProductStorageByID)
  .put(
    auth(),
    validate(productstorageValidation.updateProductStorage),
    productstorageController.updateProductStorage
  )
  .delete(auth(), productstorageController.deleteProductStorage);

router
  .route("/q/:productId/:locationId")
  .put(auth(), productstorageController.updateProductQuantity);

// router.route("/stock/:locationId").get(productstorageController.getstockreport);
router.route("/report/warehouse/:locationId").get(productstorageController.getstockreport);
// router.route("/stock/all").get(productstorageController.getstockreport);// New route

module.exports = router;
