'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventorytransactions', {
      TransactionID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SalesOrderID:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'salesorders',
          key: 'OrderID'
        }
      },
      PurchaseOrderID: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
        type: Sequelize.DECIMAL(10, 2)
      },
      TransactionDate: {
        type: Sequelize.DATE
      },
      TransactionType: {
        type: Sequelize.ENUM('FULFILL', 'RETURN', 'EXCHANGE')
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
    await queryInterface.dropTable('inventorytransactions');
  }
};