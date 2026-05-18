const db = require('../models');
const Batch = db.productbatch;
const Product = db.product;
const { Op } = require('sequelize');

const getBatchesByProduct = async (req, res) => {
  try {
    const batches = await Batch.findAll({ where: { ProductID: req.params.productId }, order: [['ExpiryDate', 'ASC']] });
    res.status(200).json({ batches });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getExpiringBatches = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + days);
    const batches = await Batch.findAll({
      where: { ExpiryDate: { [Op.lte]: limitDate, [Op.gte]: new Date() }, Quantity: { [Op.gt]: 0 } },
      include: [{ model: Product, as: 'product', attributes: ['ProductID', 'Name', 'SKU'] }],
      order: [['ExpiryDate', 'ASC']],
    });
    res.status(200).json({ batches });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const createBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    await Product.increment('QuantityInStock', { by: req.body.Quantity, where: { ProductID: req.body.ProductID } });
    res.status(201).json({ batch });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const updateBatch = async (req, res) => {
  try {
    await Batch.update(req.body, { where: { BatchID: req.params.id } });
    res.status(200).json({ message: 'Batch updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    await Product.decrement('QuantityInStock', { by: batch.Quantity, where: { ProductID: batch.ProductID } });
    await batch.destroy();
    res.status(200).json({ message: 'Batch deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getBatchesByProduct, getExpiringBatches, createBatch, updateBatch, deleteBatch };
