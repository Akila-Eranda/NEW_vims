'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchaseorders', {
      OrderID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderDate: {
        type: Sequelize.DATE
      },
      TotalAmount: {
        type: Sequelize.DECIMAL
      },
      Status: {
        type: Sequelize.STRING
      },
      Discount: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      DiscountID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'discounts',
          key: 'DiscountID'
        }
      },
      NetAmount: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchaseorders');
  }
};