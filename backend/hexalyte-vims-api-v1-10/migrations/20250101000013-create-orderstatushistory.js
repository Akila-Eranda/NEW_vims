'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderstatushistories', {
      StatusID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      purchaseorderOrderID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'purchaseorders',
          key: 'OrderID'
        }
      },
      salesorderOrderID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'salesorders',
          key: 'OrderID'
        }
      },
      OldStatus: {
        type: Sequelize.STRING
      },
      NewStatus: {
        type: Sequelize.STRING
      },
      StatusChangeDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('orderstatushistories');
  }
};