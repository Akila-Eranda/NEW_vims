'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class salesorderdetail extends Model {
    static associate(models) {
      salesorderdetail.belongsTo(models.salesorder, { foreignKey: 'OrderID', as: 'salesorder' });
      salesorderdetail.belongsTo(models.product, { foreignKey: 'ProductID', as: 'product' });
    }
  }

  salesorderdetail.init({
    OrderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'salesorders',
        key: 'OrderID'
      }
    },
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'products',
        key: 'ProductID'
      }
    },
    Quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    UnitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'salesorderdetail',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt'
  });

  return salesorderdetail;
};
