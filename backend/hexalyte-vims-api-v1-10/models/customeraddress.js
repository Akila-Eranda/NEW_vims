"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class customeraddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // customeraddress.belongsTo(models.customer, { foreignKey: "CustomerAddressID" });
      customeraddress.hasMany(models.customer, { foreignKey: 'CustomerAddressID' })
      customeraddress.hasMany(models.deliverydetails, {
        foreignKey: "DeliveryAddressID",
      });
    }
  }
  customeraddress.init(
    {
      AddressID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      AddressType: {
        type: DataTypes.STRING(20),
      },
      Street: {
        type: DataTypes.STRING(255),
      },
      City: {
        type: DataTypes.STRING(100),
      },
      State: {
        type: DataTypes.STRING(100),
      },
      PostalCode: {
        type: DataTypes.STRING(20),
      },
      Country: {
        type: DataTypes.STRING(50),
      },
      IsDefault: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "customeraddress",
    }
  );
  return customeraddress;
};
