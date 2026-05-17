const httpStatus = require("http-status");
const { generateAndSaveSalesorderInvoice } = require("../service/salesorderInvoice.service");
const catchAsync = require("../utils/catchAsync");

const saveSalesOrderInvoice = catchAsync(async(req, res) => {

    const order = {
        OrderID: req.body.OrderID,
        OrderDate: req.body.salesOrderInfo.OrderDate,
        TotalAmount:  req.body.salesOrderInfo.TotalAmount
    }

    const items = req.body.salesItems

    const invoice = await generateAndSaveSalesorderInvoice(order, items)

    // console.log(items)

    return res.status(httpStatus.OK).send({
        invoice
        // "message": "ok"
    })
})

module.exports = {
    saveSalesOrderInvoice
}