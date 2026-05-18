const db = require('../models');
const Quotation = db.quotation;
const QuotationItem = db.quotationitem;
const { Op } = require('sequelize');

const generateQuotationNumber = async () => {
  const count = await Quotation.count();
  return `QT-${String(count + 1).padStart(5, '0')}`;
};

const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      include: [
        { model: db.customer, as: 'customer', attributes: ['CustomerID', 'Name', 'Phone'] },
        { model: db.user, as: 'salesRep', attributes: ['id', 'firstname', 'lastname'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ quotations });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [
        { model: db.customer, as: 'customer' },
        { model: db.user, as: 'salesRep', attributes: ['id', 'firstname', 'lastname'] },
        { model: QuotationItem, as: 'items', include: [{ model: db.product, as: 'product', attributes: ['ProductID', 'Name', 'SKU', 'SellingPrice'] }] },
      ],
    });
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    res.status(200).json({ quotation });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const createQuotation = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { items, ...quotationData } = req.body;
    quotationData.QuotationNumber = await generateQuotationNumber();
    const quotation = await Quotation.create(quotationData, { transaction: t });
    if (items && items.length > 0) {
      const quotationItems = items.map(item => ({ ...item, QuotationID: quotation.QuotationID }));
      await QuotationItem.bulkCreate(quotationItems, { transaction: t });
    }
    await t.commit();
    res.status(201).json({ quotation });
  } catch (e) { await t.rollback(); res.status(500).json({ error: e.message }); }
};

const updateQuotationStatus = async (req, res) => {
  try {
    await Quotation.update({ Status: req.body.Status }, { where: { QuotationID: req.params.id } });
    res.status(200).json({ message: 'Status updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const deleteQuotation = async (req, res) => {
  try {
    await QuotationItem.destroy({ where: { QuotationID: req.params.id } });
    await Quotation.destroy({ where: { QuotationID: req.params.id } });
    res.status(200).json({ message: 'Quotation deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getAllQuotations, getQuotationById, createQuotation, updateQuotationStatus, deleteQuotation };
