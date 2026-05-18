'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
      Vehicle.belongsTo(models.driver, { foreignKey: 'AssignedDriverID', as: 'driver' });
    }
  }
  Vehicle.init({
    VehicleID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    VehicleNumber: { type: DataTypes.STRING(50), allowNull: false },
    Type: { type: DataTypes.ENUM('Van', 'Truck', 'Motorbike', 'Car', 'ThreeWheeler'), defaultValue: 'Van' },
    Capacity: DataTypes.DECIMAL(10, 2),
    CapacityUnit: { type: DataTypes.ENUM('Kg', 'L', 'Units'), defaultValue: 'Kg' },
    AssignedDriverID: DataTypes.INTEGER,
    Status: { type: DataTypes.ENUM('Active', 'Maintenance', 'Inactive'), defaultValue: 'Active' },
    Notes: DataTypes.TEXT,
  }, { sequelize, modelName: 'vehicle', tableName: 'vehicles' });
  return Vehicle;
};
