const express = require('express');
const router = express.Router();
const outstandingController = require('../../controller/outstanding.controller');
const { auth } = require('../../middleware/auth');

router.get('/balances', auth(), outstandingController.getOutstandingBalances);
router.get('/rep-performance', auth(), outstandingController.getRepPerformance);

module.exports = router;
