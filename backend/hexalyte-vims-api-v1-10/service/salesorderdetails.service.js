    const { where, Op } = require('sequelize');
const db = require('../models');
    const Salesorderdetails= db.salesorderdetail;
    const Product = db.product;
    const Salesorder = db.salesorder;

    const createorderdetails = async (params) => {
        const { OrderId, ProductId, Quantity, UnitPrice } = params;

        const OrderInstance = await Salesorder.findByPk(OrderId);
        if (!OrderInstance) {
            return { status: "failure", message: `No order found with order ID ${OrderId}` };
        }

        const ProductInstance = await Product.findByPk(ProductId);
        if (!ProductInstance) {
            return { status: "failure", message: `No product found with product ID ${ProductId}` };
        }


        const [orderdetails, created] = await Salesorderdetails.findOrCreate({
            where: { OrderID: OrderId, ProductID: ProductId },
            defaults: { OrderID: OrderId, ProductID: ProductId, Quantity, UnitPrice }
        });

        if (created) {
            return { status: "success", data: orderdetails };
        }
        return { status: "failure", message: "Sales order detail already exists" };
    };

    const getallorderdetails = async () => {
        const orderdetails = await Salesorderdetails.findAll();
        return { status: "success", data: orderdetails };
    };

    const getorderdetailsBYId = async (id) => {
        const orderdetails = await Salesorderdetails.findByPk(id);
        if (!orderdetails) {
            return { status: "failure", message: "Sales order detail not found" };
        }
        return { status: "success", data: orderdetails };
    };

    const getSalesOrderDetailsByOrderID = async (OrderID) => {
        const orderDetails = await Salesorderdetails.findAll({
            where: { OrderID: { [Op.eq]: OrderID } },
            include: [{
                model: db.product,
                as: 'product',
                required: false
            }]
        })

        if (!orderDetails[0]) {
            return {
                status: "fail",
                message: "No sales order details found"
            }
        }

        return {
            status: "success",
            data: orderDetails
        }

        // return orderDetails
        
    }

    const updateorderdetailsById = async (id, updateBody) => {
        const { Quantity, UnitPrice } = updateBody;

        const orderdetails = await Salesorderdetails.findByPk(id);
        if (!orderdetails) {
            return { status: "failure", message: "Sales order detail not found" };
        }

        await orderdetails.update({ Quantity, UnitPrice });

        return { status: "success", message: "Sales order detail updated", data: orderdetails };
    };

    const deleteorderdetailsById = async (id) => {
        const orderdetails = await Salesorderdetails.findByPk(id);
        if (!orderdetails) {
            return { status: "failure", message: "Sales order detail not found" };
        }

        await orderdetails.destroy();
        return { status: "success", message: "Sales order detail deleted" };
    };

    module.exports = {
        createorderdetails,
        getallorderdetails,
        getorderdetailsBYId,
        getSalesOrderDetailsByOrderID,
        updateorderdetailsById,
        deleteorderdetailsById
    };