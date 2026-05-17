'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventorytransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      inventorytransaction.belongsTo(models.product, {foreignKey: 'ProductID'})
      inventorytransaction.belongsTo(models.salesorder, {foreignKey: 'SalesOrderID'})
      inventorytransaction.belongsTo(models.purchaseorder, {foreignKey: 'PurchaseOrderID'})
    }
  }
  inventorytransaction.init({
    TransactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true  
    },
    // OrderID: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    SalesOrderID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PurchaseOrderID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Quantity: DataTypes.DECIMAL(10, 2),
    TransactionDate: DataTypes.DATE,
    TransactionType: DataTypes.ENUM('FULFILL', 'RETURN' , 'EXCHANGE')
  }, {
    sequelize,
    modelName: 'inventorytransaction',
  });
  return inventorytransaction;
};