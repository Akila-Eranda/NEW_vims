'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salesorders', {
      OrderID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CustomerID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'CustomerID'
        }
      },
      OrderDate: {
        type: Sequelize.DATE
      },
      TotalAmount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      Status: {
        type: Sequelize.STRING
      },
      Discount: {
        type: Sequelize.DECIMAL
      },
      DiscountID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'discounts',
          key: 'DiscountID'
        }
      },
      LocationID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'warehouselocations',
          key: 'LocationID'
        }
      },
      PaymentStatus: {
        type: Sequelize.ENUM('UNPAID', 'PAID')
      },
       isActive: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('salesorders');
  }
};