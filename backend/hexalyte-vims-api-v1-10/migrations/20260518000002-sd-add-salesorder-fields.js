'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('salesorders', 'SalesRepID', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    });
    await queryInterface.addColumn('salesorders', 'PaymentMode', {
      type: Sequelize.ENUM('Cash', 'Credit', 'Cheque', 'BankTransfer'),
      defaultValue: 'Cash',
      allowNull: true
    });
    await queryInterface.addColumn('salesorders', 'DueDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('salesorders', 'PaidAmount', {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: true
    });
    await queryInterface.addColumn('salesorders', 'RouteID', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('salesorders', 'SalesRepID');
    await queryInterface.removeColumn('salesorders', 'PaymentMode');
    await queryInterface.removeColumn('salesorders', 'DueDate');
    await queryInterface.removeColumn('salesorders', 'PaidAmount');
    await queryInterface.removeColumn('salesorders', 'RouteID');
  }
};
