'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchaseorderdetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'purchaseorders',
          key: 'OrderID'
        }
      },
      ProductID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'ProductID'
        }
      },
      Quantity: {
        type: Sequelize.INTEGER
      },
      UnitPrice: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('purchaseorderdetails');
  }
};