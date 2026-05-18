const express = require('express');
const router = express.Router();
const salesRepController = require('../../controller/salesrep.controller');
const { auth } = require('../../middleware/auth');

router.get('/summary', auth('getUsers'), salesRepController.getSalesRepSummary);
router.get('/targets', auth('getUsers'), salesRepController.getTargets);
router.post('/targets', auth('manageUsers'), salesRepController.setTarget);
router.put('/targets/:SalesRepID/:Month/:Year/achievements', auth('manageUsers'), salesRepController.updateAchievements);

module.exports = router;
