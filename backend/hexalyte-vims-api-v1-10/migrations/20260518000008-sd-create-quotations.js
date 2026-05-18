'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quotations', {
      QuotationID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      QuotationNumber: { type: Sequelize.STRING(50), unique: true },
      CustomerID: { type: Sequelize.INTEGER, references: { model: 'customers', key: 'CustomerID' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      SalesRepID: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      QuotationDate: { type: Sequelize.DATEONLY, allowNull: false },
      ValidUntil: { type: Sequelize.DATEONLY },
      TotalAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      Discount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      Status: { type: Sequelize.ENUM('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'), defaultValue: 'Draft' },
      Notes: { type: Sequelize.TEXT },
      ConvertedOrderID: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('quotationitems', {
      ItemID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      QuotationID: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'quotations', key: 'QuotationID' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      ProductID: { type: Sequelize.INTEGER, references: { model: 'products', key: 'ProductID' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      Quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      UnitPrice: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      Discount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      Total: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('quotationitems');
    await queryInterface.dropTable('quotations');
  }
};
