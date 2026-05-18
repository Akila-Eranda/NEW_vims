'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // Brands table
    await queryInterface.createTable('brands', {
      BrandID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      Name: { type: Sequelize.STRING(100), allowNull: false },
      Description: { type: Sequelize.TEXT },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Add brand, SKU, barcode to products
    await queryInterface.addColumn('products', 'BrandID', { type: Sequelize.INTEGER, references: { model: 'brands', key: 'BrandID' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' });
    await queryInterface.addColumn('products', 'SKU', { type: Sequelize.STRING(100), unique: true });
    await queryInterface.addColumn('products', 'Barcode', { type: Sequelize.STRING(100) });
    await queryInterface.addColumn('products', 'Unit', { type: Sequelize.ENUM('Pcs', 'Kg', 'L', 'Box', 'Carton', 'Dozen', 'Pack'), defaultValue: 'Pcs' });
    await queryInterface.addColumn('products', 'ReorderLevel', { type: Sequelize.INTEGER, defaultValue: 0 });
    await queryInterface.addColumn('products', 'HasBatchTracking', { type: Sequelize.BOOLEAN, defaultValue: false });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'HasBatchTracking');
    await queryInterface.removeColumn('products', 'ReorderLevel');
    await queryInterface.removeColumn('products', 'Unit');
    await queryInterface.removeColumn('products', 'Barcode');
    await queryInterface.removeColumn('products', 'SKU');
    await queryInterface.removeColumn('products', 'BrandID');
    await queryInterface.dropTable('brands');
  }
};
