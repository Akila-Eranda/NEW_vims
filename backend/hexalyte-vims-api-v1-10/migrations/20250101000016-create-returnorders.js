'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('returnorders', {

            ReturnID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            SalesOrderID: {
                type: Sequelize.INTEGER,
                references: {
                    model: "salesorders",
                    key: "OrderID"
                },
                allowNull: true
            },

            PurchaseOrderID: {
                type: Sequelize.INTEGER,
                references: {
                    model: "purchaseorders",
                    key: "OrderID"
                },
                allowNull: true
            },

            ReturnDate: {
                type: Sequelize.DATE,
                allowNull: false
            },

            Reason: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            CreatedBy: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id'
                }
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
        await queryInterface.dropTable('returnorders');
    }
};
