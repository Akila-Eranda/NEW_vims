'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class purchaseorder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      purchaseorder.hasMany(models.orderstatushistory)
      // purchaseorder.belongsToMany(models.product, {
      //   through: models.purchaseorderdetail,
      //   foreignKey: 'OrderID'
      // })

      purchaseorder.hasMany(models.returnorders, { foreignKey: 'PurchaseOrderID' })
      
    }
  }
  purchaseorder.init({
    OrderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    OrderDate: DataTypes.DATE,
    TotalAmount: DataTypes.DECIMAL(10, 2),
    Status: DataTypes.STRING(20),
    Discount: {
      type: DataTypes.DECIMAL
    },
    NetAmount: {
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'purchaseorder',
  });
  return purchaseorder;
};