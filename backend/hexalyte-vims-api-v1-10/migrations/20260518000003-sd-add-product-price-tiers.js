'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'WholesalePrice', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('products', 'AgentPrice', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'WholesalePrice');
    await queryInterface.removeColumn('products', 'AgentPrice');
  }
};
