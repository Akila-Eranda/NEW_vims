const db = require('../models');
const SalesRepTarget = db.salesreptarget;
const SalesOrder = db.salesorder;
const { Op } = require('sequelize');

const getTargets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const where = {};
    if (month) where.Month = month;
    if (year) where.Year = year;
    const targets = await SalesRepTarget.findAll({
      where,
      include: [{ model: db.user, as: 'salesRep', attributes: ['id', 'firstname', 'lastname', 'email'] }],
      order: [['Year', 'DESC'], ['Month', 'DESC']],
    });
    res.status(200).json({ targets });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const setTarget = async (req, res) => {
  try {
    const { SalesRepID, Month, Year } = req.body;
    const [target, created] = await SalesRepTarget.findOrCreate({
      where: { SalesRepID, Month, Year },
      defaults: req.body,
    });
    if (!created) await target.update(req.body);
    res.status(200).json({ target });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const updateAchievements = async (req, res) => {
  try {
    const { SalesRepID, Month, Year } = req.params;
    const startDate = new Date(Year, Month - 1, 1);
    const endDate = new Date(Year, Month, 0);

    const orders = await SalesOrder.findAll({
      where: {
        SalesRepID,
        OrderDate: { [Op.between]: [startDate, endDate] },
        Status: { [Op.in]: ['Completed', 'Delivered'] },
      },
    });

    const achievedAmount = orders.reduce((sum, o) => sum + parseFloat(o.TotalAmount || 0), 0);
    const achievedOrders = orders.length;

    const target = await SalesRepTarget.findOne({ where: { SalesRepID, Month, Year } });
    if (target) {
      const commissionEarned = (achievedAmount * parseFloat(target.CommissionRate || 0)) / 100;
      await target.update({ AchievedAmount: achievedAmount, AchievedOrders: achievedOrders, CommissionEarned: commissionEarned });
    }

    res.status(200).json({ message: 'Achievements updated', achievedAmount, achievedOrders });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getSalesRepSummary = async (req, res) => {
  try {
    const users = await db.user.findAll({
      where: { role: 'user' },
      attributes: ['id', 'firstname', 'lastname', 'email'],
      include: [
        { model: db.customer, as: 'assignedCustomers', attributes: ['CustomerID', 'Name'] },
        { model: db.salesroute, as: 'routes', attributes: ['RouteID', 'RouteName'] },
      ],
    });
    res.status(200).json({ salesReps: users });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getTargets, setTarget, updateAchievements, getSalesRepSummary };
