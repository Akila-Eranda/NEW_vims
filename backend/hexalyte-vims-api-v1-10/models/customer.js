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