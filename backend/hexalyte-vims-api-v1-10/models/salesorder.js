'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class salesorder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      salesorder.hasMany(models.deliverydetails, { foreignKey: 'OrderID' })
      salesorder.hasMany(models.orderstatushistory)
      salesorder.belongsToMany(models.product, {
        through: models.salesorderdetail,
        foreignKey: 'OrderID'
      })
      salesorder.belongsTo(models.warehouselocation, { foreignKey: 'LocationID' })
      salesorder.belongsTo(models.customer, { foreignKey: "CustomerID", as: 'customer' });

      salesorder.hasMany(models.returnorders, { foreignKey: 'SalesOrderID' })

    }
  }
  salesorder.init({
    OrderID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      references: {
        model: "customers",
        key: "CustomerID",
      },
    },
    OrderDate: DataTypes.DATE,
    TotalAmount: DataTypes.DECIMAL(10, 2),
    Status: DataTypes.STRING,
    Discount: DataTypes.DECIMAL(10, 2),
    PaymentStatus: DataTypes.ENUM('UNPAID', 'PAID'),
    DiscountID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'discounts',
        key: 'DiscountID'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'salesorder',
  });
  return salesorder;
};