'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      VehicleID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      VehicleNumber: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      Type: { type: Sequelize.ENUM('Van', 'Truck', 'Motorbike', 'Car', 'ThreeWheeler'), defaultValue: 'Van' },
      Capacity: { type: Sequelize.DECIMAL(10, 2) },
      CapacityUnit: { type: Sequelize.ENUM('Kg', 'L', 'Units'), defaultValue: 'Kg' },
      AssignedDriverID: { type: Sequelize.INTEGER },
      Status: { type: Sequelize.ENUM('Active', 'Maintenance', 'Inactive'), defaultValue: 'Active' },
      Notes: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('drivers', {
      DriverID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      Name: { type: Sequelize.STRING(100), allowNull: false },
      Phone: { type: Sequelize.STRING(20) },
      LicenseNumber: { type: Sequelize.STRING(50) },
      LicenseExpiry: { type: Sequelize.DATEONLY },
      NIC: { type: Sequelize.STRING(20) },
      Address: { type: Sequelize.TEXT },
      AssignedVehicleID: { type: Sequelize.INTEGER },
      Status: { type: Sequelize.ENUM('Active', 'Inactive', 'OnLeave'), defaultValue: 'Active' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Add vehicle & driver to deliverydetails
    await queryInterface.addColumn('deliverydetails', 'VehicleID', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('deliverydetails', 'DriverID', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('deliverydetails', 'RouteID', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('deliverydetails', 'Notes', { type: Sequelize.TEXT });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('deliverydetails', 'Notes');
    await queryInterface.removeColumn('deliverydetails', 'RouteID');
    await queryInterface.removeColumn('deliverydetails', 'DriverID');
    await queryInterface.removeColumn('deliverydetails', 'VehicleID');
    await queryInterface.dropTable('drivers');
    await queryInterface.dropTable('vehicles');
  }
};
