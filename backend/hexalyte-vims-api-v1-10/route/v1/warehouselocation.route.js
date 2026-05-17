const express = require('express');
const router = express.Router();
const locationController = require('../../controller/warehouselocation.controller'); 
const validate = require('../../middleware/validate');
const warehouselocationValidation = require('../../validations/warehouselocation.validation');
const {auth} = require('../../middleware/auth');


router
    .route('/')
    .post(auth(), validate(warehouselocationValidation.createwarehouselocation), locationController.createlocation)
    .get(auth(), locationController.getalllocation);

router
    .route('/:id')
    .get(auth(), locationController.getlocationbyID)
    .delete(auth(), validate(warehouselocationValidation.deletewarehouselocation), locationController.deletelocation)
    .put(auth(), locationController.updatelocation);

module.exports = router;
