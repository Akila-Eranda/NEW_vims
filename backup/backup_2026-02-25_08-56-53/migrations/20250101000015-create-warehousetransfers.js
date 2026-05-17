'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('warehousetransfers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ProductID: {
                type: Sequelize.INTEGER,
                references: {
                    model: "products",
                    key: "ProductID"
                },
                allowNull: true
            },

            sourceWarehouseId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "warehouselocations",
                    key: "LocationID"
                },
                allowNull: true
            },
            targetWarehouseId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "warehouselocations",
                    key: "LocationID"
                },
                allowNull: true
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            transferDate: {
                type: Sequelize.DATE
            },
            transferBy: {
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "id"
                },
                allowNull: true
            },
            notes: {
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
        await queryInterface.dropTable('warehousetransfers');
    }
};
