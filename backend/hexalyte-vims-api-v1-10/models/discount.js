'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  discount.init({
    DiscountID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Amount: DataTypes.STRING,
    PurchaseOrders: {
      type: DataTypes.BOOLEAN
    },
    SalesOrders: {
      type: DataTypes.BOOLEAN
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'discount',
  });
  return discount;
};