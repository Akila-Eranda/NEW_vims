'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deliverydetails', {
      DeliveryID: {
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
      DeliveryAddressID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customeraddresses',
          key: 'AddressID'
        }
      },
      OrderID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'salesorders',
          key: 'OrderID'
        }
      },
      DeliveryDate: {
        type: Sequelize.DATE
      },
      DeliveryTimeSlot: {
        type: Sequelize.STRING
      },
      DeliveryStatus: {
        type: Sequelize.STRING
      },
      TrackingNumber: {
        type: Sequelize.STRING
      },
      Carrier: {
        type: Sequelize.STRING
      },
      EstimatedDeliveryDate: {
        type: Sequelize.DATE
      },
      ActualDeliveryDate: {
        type: Sequelize.DATE
      },
      PaymentStatus: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('deliverydetails');
  }
};