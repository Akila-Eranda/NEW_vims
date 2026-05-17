const db = require('../models');
const Product = db.product;

const createProduct = async (params) => {
  const { Name, Description, UnitPrice, QuantityInStock, SupplierID, CategoryID } = params;
  const product = { Name, Description, UnitPrice, QuantityInStock, SupplierID, CategoryID };

  const [row, created] = await Product.findOrCreate({
    where: { Name: Name },
    defaults: product,
  });

  if (created) {
    return row;
  }
  return null;
};

const getAllProducts = async () => {
  const products = await Product.findAll();
  return products;
};

const getProductById = async (ProductID) => {
  const product = await Product.findOne({ where: { ProductID } });
  return product;
};

const updateProductById = async (ProductID, updateBody) => {
  const { Name, Description, UnitPrice, QuantityInStock, SupplierID, CategoryID } = updateBody;
  const product = { Name, Description, UnitPrice, QuantityInStock, SupplierID, CategoryID };

  const row = await Product.update(product, {
    where: { ProductID: ProductID },
  });
  return row;
};

const deleteProductById = async (ProductID) => {
  const product = await getProductById(ProductID);
  if (!product) return null;
  await product.destroy();
  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById
};
