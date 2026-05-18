'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quotation extends Model {
    static associate(models) {
      Quotation.belongsTo(models.customer, { foreignKey: 'CustomerID', as: 'customer' });
      Quotation.belongsTo(models.user, { foreignKey: 'SalesRepID', as: 'salesRep' });
      Quotation.hasMany(models.quotationitem, { foreignKey: 'QuotationID', as: 'items' });
    }
  }
  Quotation.init({
    QuotationID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    QuotationNumber: DataTypes.STRING(50),
    CustomerID: DataTypes.INTEGER,
    SalesRepID: DataTypes.INTEGER,
    QuotationDate: { type: DataTypes.DATEONLY, allowNull: false },
    ValidUntil: DataTypes.DATEONLY,
    TotalAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    Discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    Status: { type: DataTypes.ENUM('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'), defaultValue: 'Draft' },
    Notes: DataTypes.TEXT,
    ConvertedOrderID: DataTypes.INTEGER,
  }, { sequelize, modelName: 'quotation', tableName: 'quotations' });
  return Quotation;
};
