'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      customer.hasMany(models.deliverydetails, {foreignKey: 'CustomerID'})
      customer.belongsTo(models.customeraddress, {foreignKey: 'CustomerAddressID', targetKey: 'AddressID'});
      customer.belongsTo(models.user, { foreignKey: 'SalesRepID', as: 'salesRep' });
      customer.belongsTo(models.salesroute, { foreignKey: 'RouteID', as: 'route' });
      customer.hasMany(models.payment, { foreignKey: 'CustomerID', as: 'payments' });
    }
  }
  customer.init({
    CustomerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CustomerAddressID: {
      type: DataTypes.INTEGER,
      references: {
        model: "customeraddresses",
        key: "AddressID",
      },
    },
    Name: DataTypes.STRING,
    CompanyName: DataTypes.STRING,
    Phone: DataTypes.STRING,
    Email: DataTypes.STRING,
    Note: DataTypes.TEXT,
    CustomerType: {
      type: DataTypes.ENUM('Retailer', 'Wholesaler', 'Agent', 'Direct'),
      defaultValue: 'Retailer',
      allowNull: true
    },
    CreditLimit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: true
    },
    CreditDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    SalesRepID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RouteID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'customer',
  });
  return customer;
};