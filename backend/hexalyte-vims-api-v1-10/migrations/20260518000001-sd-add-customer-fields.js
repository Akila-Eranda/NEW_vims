'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'CustomerType', {
      type: Sequelize.ENUM('Retailer', 'Wholesaler', 'Agent', 'Direct'),
      defaultValue: 'Retailer',
      allowNull: true
    });
    await queryInterface.addColumn('customers', 'CreditLimit', {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: true
    });
    await queryInterface.addColumn('customers', 'CreditDays', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    });
    await queryInterface.addColumn('customers', 'SalesRepID', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    });
    await queryInterface.addColumn('customers', 'RouteID', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('customers', 'CustomerType');
    await queryInterface.removeColumn('customers', 'CreditLimit');
    await queryInterface.removeColumn('customers', 'CreditDays');
    await queryInterface.removeColumn('customers', 'SalesRepID');
    await queryInterface.removeColumn('customers', 'RouteID');
  }
};
