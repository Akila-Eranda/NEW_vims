'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductBatch extends Model {
    static associate(models) {
      ProductBatch.belongsTo(models.product, { foreignKey: 'ProductID', as: 'product' });
    }
  }
  ProductBatch.init({
    BatchID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ProductID: { type: DataTypes.INTEGER, allowNull: false },
    BatchNumber: { type: DataTypes.STRING(100), allowNull: false },
    ManufactureDate: DataTypes.DATEONLY,
    ExpiryDate: DataTypes.DATEONLY,
    Quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    BuyingPrice: DataTypes.DECIMAL(10, 2),
    SupplierID: DataTypes.INTEGER,
    Notes: DataTypes.TEXT,
  }, { sequelize, modelName: 'productbatch', tableName: 'productbatches' });
  return ProductBatch;
};
