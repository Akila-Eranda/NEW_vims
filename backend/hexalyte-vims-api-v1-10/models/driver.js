'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Driver extends Model {
    static associate(models) {
      Driver.hasOne(models.vehicle, { foreignKey: 'AssignedDriverID', as: 'vehicle' });
    }
  }
  Driver.init({
    DriverID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Name: { type: DataTypes.STRING(100), allowNull: false },
    Phone: DataTypes.STRING(20),
    LicenseNumber: DataTypes.STRING(50),
    LicenseExpiry: DataTypes.DATEONLY,
    NIC: DataTypes.STRING(20),
    Address: DataTypes.TEXT,
    AssignedVehicleID: DataTypes.INTEGER,
    Status: { type: DataTypes.ENUM('Active', 'Inactive', 'OnLeave'), defaultValue: 'Active' },
  }, { sequelize, modelName: 'driver', tableName: 'drivers' });
  return Driver;
};
