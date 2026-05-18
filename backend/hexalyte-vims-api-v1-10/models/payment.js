'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    static associate(models) {
      payment.belongsTo(models.salesorder, { foreignKey: 'OrderID', as: 'order' });
      payment.belongsTo(models.customer, { foreignKey: 'CustomerID', as: 'customer' });
      payment.belongsTo(models.user, { foreignKey: 'CollectedBy', as: 'collectedBy' });
    }
  }
  payment.init({
    PaymentID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'salesorders', key: 'OrderID' }
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'customers', key: 'CustomerID' }
    },
    Amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    PaymentMode: {
      type: DataTypes.ENUM('Cash', 'Cheque', 'BankTransfer', 'Credit'),
      defaultValue: 'Cash'
    },
    PaymentDate: { type: DataTypes.DATE, allowNull: false },
    Reference: { type: DataTypes.STRING(100), allowNull: true },
    Notes: { type: DataTypes.TEXT, allowNull: true },
    CollectedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    }
  }, { sequelize, modelName: 'payment' });
  return payment;
};
