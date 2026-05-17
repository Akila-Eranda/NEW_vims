'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class purchaseorderdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      purchaseorderdetail.belongsTo(models.purchaseorder, { foreignKey: 'OrderID' });
      purchaseorderdetail.belongsTo(models.product, { foreignKey: 'ProductID' });
    }
  }
  purchaseorderdetail.init({
    OrderID: {
      type: DataTypes.INTEGER,
    },
    ProductID: {
      type: DataTypes.INTEGER,
    },
    Quantity: DataTypes.INTEGER,
    UnitPrice: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'purchaseorderdetail',
  });
  return purchaseorderdetail;
};