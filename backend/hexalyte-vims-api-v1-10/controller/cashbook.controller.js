const db = require('../models');
const CashBook = db.cashbook;
const { Op } = require('sequelize');

const getAllEntries = async (req, res) => {
  try {
    const { from, to, type } = req.query;
    const where = {};
    if (from && to) where.EntryDate = { [Op.between]: [from, to] };
    if (type) where.Type = type;

    const entries = await CashBook.findAll({
      where,
      include: [{ model: db.user, as: 'createdBy', attributes: ['id', 'firstname', 'lastname'] }],
      order: [['EntryDate', 'DESC'], ['createdAt', 'DESC']],
    });

    const totals = await CashBook.findAll({
      where,
      attributes: ['Type', [db.sequelize.fn('SUM', db.sequelize.col('Amount')), 'total']],
      group: ['Type'],
      raw: true,
    });

    const income = totals.find(t => t.Type === 'Income')?.total || 0;
    const expense = totals.find(t => t.Type === 'Expense')?.total || 0;

    res.status(200).json({ entries, summary: { income: parseFloat(income), expense: parseFloat(expense), balance: parseFloat(income) - parseFloat(expense) } });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const createEntry = async (req, res) => {
  try {
    const entry = await CashBook.create({ ...req.body, CreatedByID: req.user?.id });
    res.status(201).json({ entry });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const updateEntry = async (req, res) => {
  try {
    await CashBook.update(req.body, { where: { EntryID: req.params.id } });
    res.status(200).json({ message: 'Entry updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const deleteEntry = async (req, res) => {
  try {
    await CashBook.destroy({ where: { EntryID: req.params.id } });
    res.status(200).json({ message: 'Entry deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getDailyCollection = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const entries = await CashBook.findAll({
      where: { EntryDate: date, Type: 'Income' },
      include: [{ model: db.user, as: 'createdBy', attributes: ['id', 'firstname', 'lastname'] }],
      order: [['createdAt', 'ASC']],
    });
    const total = entries.reduce((sum, e) => sum + parseFloat(e.Amount), 0);
    res.status(200).json({ date, entries, total });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getAllEntries, createEntry, updateEntry, deleteEntry, getDailyCollection };
