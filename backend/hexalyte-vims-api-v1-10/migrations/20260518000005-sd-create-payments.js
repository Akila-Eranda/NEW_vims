'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      PaymentID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      OrderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'salesorders', key: 'OrderID' }
      },
      CustomerID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'customers', key: 'CustomerID' }
      },
      Amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      PaymentMode: {
        type: Sequelize.ENUM('Cash', 'Cheque', 'BankTransfer', 'Credit'),
        defaultValue: 'Cash'
      },
      PaymentDate: { type: Sequelize.DATE, allowNull: false },
      Reference: { type: Sequelize.STRING(100), allowNull: true },
      Notes: { type: Sequelize.TEXT, allowNull: true },
      CollectedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' }
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('payments');
  }
};
