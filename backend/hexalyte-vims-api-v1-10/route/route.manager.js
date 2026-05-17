const userRoute = require('./v1/user.route');
const authRoute = require('./v1/auth.route');
const helloRoute = require('./v1/hello.route');
const supplier = require('./v1/supplier.route');
const salesorder = require('./v1/salesorder.route');
const WarehouseLocation = require('./v1/warehouselocation.route');
const salesorderdetails = require('./v1/salesorderdeatils.route');
const productroute = require('./v1/product.route');
const customerRoute = require('./v1/customer.route')
const categoryRoute = require('./v1/category.route')
const transaction = require('./v1/transaction.route')
const customerAddress = require('./v1/customeraddress.route')
const deliverydetailsRoute = require('./v1/deliverydetails.route')
const purchaseorderRoute = require('./v1/purchaseorder.route')
const productstorageRoute = require('./v1/productstorage.route')
const orderstatushistories = require('./v1/orderstatushistory.route')
const purchaseorderdetailRoute = require('./v1/purchaseorderdetail.route')
const discountsRoute = require('./v1/discount.route')
const onboardRoute = require('./v1/onboard.route')
const transferRoutes = require('./v1/transfer.route')
const returnOrderRoutes = require('./v1/returnorder.route')
const dashboardRoute = require('./v1/dashboard.route')
const pnlRoute = require('./v1/pnl.route')

const routeManager = (app) => {
    // API V1 Routes
    app.use('/v1/', helloRoute);
    app.use('/v1/auth', authRoute);
    app.use('/v1/user', userRoute);
    app.use('/v1/supplier', supplier);
    app.use('/v1/salesorder', salesorder);
    app.use('/v1/location', WarehouseLocation);
    app.use('/v1/salesorderdetails', salesorderdetails);
    app.use('/v1/product', productroute);
    app.use('/v1/customer', customerRoute);
    app.use('/v1/category', categoryRoute);
    app.use('/v1/transaction', transaction);
    app.use('/v1/customeraddress', customerAddress);
    app.use('/v1/deliverydetails', deliverydetailsRoute);
    app.use('/v1/purchaseorders', purchaseorderRoute);
    app.use('/v1/productstorage', productstorageRoute)
    app.use('/v1/orderstatushistory', orderstatushistories)
    app.use('/v1/purchaseorderdetail', purchaseorderdetailRoute)
    app.use('/v1/discounts', discountsRoute)
    app.use('/v1/onboard', onboardRoute)
    app.use('/v1/transfer', transferRoutes)
    app.use('/v1/return', returnOrderRoutes)
    app.use('/v1/dashboard', dashboardRoute)
    app.use('/v1/pnl', pnlRoute)
}

module.exports = routeManager;
