'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productstorage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      productstorage.belongsTo(models.product, {foreignKey:'ProductID'})
      productstorage.belongsTo(models.warehouselocation, {foreignKey:'LocationID'})
    }
  }
  productstorage.init({
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'products',
        key: 'ProductID'
      }
    },
    LocationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'warehouselocations',
        key: 'LocationID'
      }
    },
    Quantity: DataTypes.DECIMAL(10, 2),
    LastUpdated: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'productstorage',
  });
  return productstorage;
};