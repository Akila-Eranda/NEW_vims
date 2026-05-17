"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class deliverydetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      deliverydetails.belongsTo(models.customer, { foreignKey: "CustomerID" });
      deliverydetails.belongsTo(models.salesorder, { foreignKey: "OrderID" });
      deliverydetails.belongsTo(models.customeraddress, {
        foreignKey: "DeliveryAddressID",
      });
      deliverydetails.belongsTo(models.salesorder, { foreignKey: "OrderID" });
    }
  }
  deliverydetails.init(
    {
      DeliveryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      CustomerID: {
        type: DataTypes.INTEGER,
        references: {
          model: "customers",
          key: "CustomerID",
        },
      },
      DeliveryAddressID: {
        type: DataTypes.INTEGER,
        references: {
          model: "customeraddresses",
          key: "AddressID",
        },
      },
      
      OrderID: {
        type: DataTypes.INTEGER,
        references: {
          model: "salesorders",
          key: "OrderID",
        },
      },
      DeliveryDate: DataTypes.DATE,
      DeliveryTimeSlot: {
        type: DataTypes.STRING(50),
      },
      DeliveryStatus: {
        type: DataTypes.STRING(50),
      },
      TrackingNumber: {
        type: DataTypes.STRING(100),
      },
      Carrier: {
        type: DataTypes.STRING(100),
      },
      EstimatedDeliveryDate: DataTypes.DATE,
      ActualDeliveryDate: DataTypes.DATE,
      PaymentStatus: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "deliverydetails",
    }
  );
  return deliverydetails;
};
