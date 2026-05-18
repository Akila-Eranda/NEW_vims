'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CashBook extends Model {
    static associate(models) {
      CashBook.belongsTo(models.user, { foreignKey: 'CreatedByID', as: 'createdBy' });
    }
  }
  CashBook.init({
    EntryID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    EntryDate: { type: DataTypes.DATEONLY, allowNull: false },
    Type: { type: DataTypes.ENUM('Income', 'Expense'), allowNull: false },
    Category: DataTypes.STRING(100),
    Description: { type: DataTypes.STRING(255), allowNull: false },
    Amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    PaymentMethod: { type: DataTypes.ENUM('Cash', 'Bank', 'Cheque'), defaultValue: 'Cash' },
    Reference: DataTypes.STRING(100),
    RelatedOrderID: DataTypes.INTEGER,
    RelatedCustomerID: DataTypes.INTEGER,
    RelatedSupplierID: DataTypes.INTEGER,
    CreatedByID: DataTypes.INTEGER,
  }, { sequelize, modelName: 'cashbook', tableName: 'cashbook' });
  return CashBook;
};
