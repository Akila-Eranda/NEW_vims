const express = require('express');
const router = express.Router();
const transferController = require("../../controller/transfer.controller");
const { auth } = require("../../middleware/auth");

// router.post('/', transferController.transferStock);
// router.get('/', transferController.getAllTransfers);

router
    .route('/')
    .post(auth(), transferController.transferStock)
    .get(auth(), transferController.getAllTransfers);

router
    .route('/bulk')
    .post(transferController.transferBulkStock);

module.exports = router;
