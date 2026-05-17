'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('returnorderitems', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            ReturnID: {
                type: Sequelize.INTEGER,
                references: {
                    model: "returnorders",
                    key: "ReturnID"
                },
                allowNull: false
            },

            ProductID: {
                type: Sequelize.INTEGER,
                references: {
                    model: "products",
                    key: "ProductID"
                }
            },

            Quantity: {
                type: Sequelize.INTEGER
            },

            Note: {
                type: Sequelize.TEXT
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
        await queryInterface.dropTable('returnorderitems');
    }
};
