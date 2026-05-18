const db = require('../models');
const Brand = db.brand;

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({ order: [['Name', 'ASC']] });
    res.status(200).json({ brands });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ brand });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const updateBrand = async (req, res) => {
  try {
    await Brand.update(req.body, { where: { BrandID: req.params.id } });
    res.status(200).json({ message: 'Brand updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const deleteBrand = async (req, res) => {
  try {
    await Brand.destroy({ where: { BrandID: req.params.id } });
    res.status(200).json({ message: 'Brand deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getAllBrands, createBrand, updateBrand, deleteBrand };
