const ejs = require('ejs')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

async function generateAndSaveSalesorderInvoice(order, salesItems){

    const OrderID = order.OrderID

    // const items = [
    //     {
    //         ProductId: 1,
    //         Quantity: 5,
    //         UnitPrice: 200
    //     },
    //     {
    //         ProductId: 2,
    //         Quantity: 10,
    //         UnitPrice: 400
    //     },
    // ]

    const templatePath = path.join(__dirname, '..', 'template', 'salesorderInvoice.ejs')
    const html = await ejs.renderFile(templatePath, {
        OrderID: order.OrderID,
        OrderDate: order.OrderDate.slice(0, 10),
        TotalAmount: order.TotalAmount,
        items: salesItems
    })

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const fileName = `SINV-${OrderID}.pdf`
    // const filePath = path.join(__dirname, '..', 'pdf/salesorders', fileName)
    const filePath = path.join(__dirname, '..', '..', 'invoices', fileName)
    await page.pdf({ path: filePath, format: 'A4' })

    await browser.close();
    return fileName

}

module.exports = {
    generateAndSaveSalesorderInvoice
}