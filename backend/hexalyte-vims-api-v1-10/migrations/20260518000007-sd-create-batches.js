'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productbatches', {
      BatchID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      ProductID: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'products', key: 'ProductID' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      BatchNumber: { type: Sequelize.STRING(100), allowNull: false },
      ManufactureDate: { type: Sequelize.DATEONLY },
      ExpiryDate: { type: Sequelize.DATEONLY },
      Quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      BuyingPrice: { type: Sequelize.DECIMAL(10, 2) },
      SupplierID: { type: Sequelize.INTEGER },
      Notes: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('productbatches');
  }
};
