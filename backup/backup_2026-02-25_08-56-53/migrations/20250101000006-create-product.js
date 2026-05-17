'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      ProductID: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING(100)
      },
      Description: {
        type: Sequelize.STRING
      },
      SellingPrice: {
        type: Sequelize.DECIMAL(10, 2)
      },
      BuyingPrice: {
        type: Sequelize.DECIMAL(10, 2)
      },
      QuantityInStock: {
        type: Sequelize.DECIMAL(10, 2)
      },
      CategoryID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'CategoryID'
        }
      },
      SupplierID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'suppliers',
          key: 'SupplierID'
        }
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
    await queryInterface.dropTable('products');
  }
};