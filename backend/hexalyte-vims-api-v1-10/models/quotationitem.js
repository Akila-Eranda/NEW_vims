'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuotationItem extends Model {
    static associate(models) {
      QuotationItem.belongsTo(models.quotation, { foreignKey: 'QuotationID', as: 'quotation' });
      QuotationItem.belongsTo(models.product, { foreignKey: 'ProductID', as: 'product' });
    }
  }
  QuotationItem.init({
    ItemID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    QuotationID: { type: DataTypes.INTEGER, allowNull: false },
    ProductID: DataTypes.INTEGER,
    Quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    UnitPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    Discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    Total: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  }, { sequelize, modelName: 'quotationitem', tableName: 'quotationitems' });
  return QuotationItem;
};
