'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salesorderdetails', {
      
      OrderID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'salesorders',
          key: 'OrderID'
        }
      },
      ProductID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'ProductID'
        },
      primaryKey: true,
      allowNull: false,
        type: Sequelize.INTEGER
      },
      Quantity: {
        type: Sequelize.DECIMAL(10, 2),
      },
      UnitPrice: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable('salesorderdetails');
  }
};