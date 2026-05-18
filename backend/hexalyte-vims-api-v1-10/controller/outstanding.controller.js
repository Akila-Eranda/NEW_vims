const db = require('../models');
const catchAsync = require('../utils/catchAsync');
const { Op, literal } = require('sequelize');

const SalesOrder = db.salesorder;
const Customer = db.customer;
const Payment = db.payment;
const User = db.user;
const SalesRoute = db.salesroute;

const getOutstandingBalances = catchAsync(async (req, res) => {
  const { salesRepId, routeId, overdueDays } = req.query;

  const customerWhere = { isActive: true };
  if (salesRepId) customerWhere.SalesRepID = salesRepId;
  if (routeId) customerWhere.RouteID = routeId;

  const customers = await Customer.findAll({
    where: customerWhere,
    attributes: ['CustomerID', 'Name', 'CompanyName', 'Phone', 'CustomerType', 'CreditLimit', 'CreditDays'],
    include: [
      { model: User, as: 'salesRep', attributes: ['id', 'firstname', 'lastname'] },
      { model: SalesRoute, as: 'route', attributes: ['RouteID', 'RouteName'] }
    ]
  });

  const result = [];
  const today = new Date();

  for (const customer of customers) {
    const unpaidOrders = await SalesOrder.findAll({
      where: {
        CustomerID: customer.CustomerID,
        PaymentStatus: 'UNPAID',
        isActive: true
      },
      attributes: ['OrderID', 'OrderDate', 'TotalAmount', 'PaidAmount', 'DueDate', 'PaymentMode']
    });

    let totalOutstanding = 0;
    let overdueAmount = 0;
    const orders = unpaidOrders.map(order => {
      const balance = parseFloat(order.TotalAmount || 0) - parseFloat(order.PaidAmount || 0);
      totalOutstanding += balance;
      const isOverdue = order.DueDate && new Date(order.DueDate) < today;
      if (isOverdue) overdueAmount += balance;
      return {
        OrderID: order.OrderID,
        OrderDate: order.OrderDate,
        TotalAmount: order.TotalAmount,
        PaidAmount: order.PaidAmount || 0,
        Balance: balance,
        DueDate: order.DueDate,
        PaymentMode: order.PaymentMode,
        IsOverdue: isOverdue,
        DaysOverdue: isOverdue ? Math.floor((today - new Date(order.DueDate)) / 86400000) : 0
      };
    });

    if (overdueDays && overdueAmount === 0) continue;

    if (totalOutstanding > 0) {
      result.push({
        CustomerID: customer.CustomerID,
        Name: customer.Name,
        CompanyName: customer.CompanyName,
        Phone: customer.Phone,
        CustomerType: customer.CustomerType,
        CreditLimit: customer.CreditLimit,
        CreditDays: customer.CreditDays,
        SalesRep: customer.salesRep,
        Route: customer.route,
        TotalOutstanding: totalOutstanding,
        OverdueAmount: overdueAmount,
        Orders: orders
      });
    }
  }

  result.sort((a, b) => b.OverdueAmount - a.OverdueAmount);

  const summary = {
    TotalCustomers: result.length,
    TotalOutstanding: result.reduce((s, r) => s + r.TotalOutstanding, 0),
    TotalOverdue: result.reduce((s, r) => s + r.OverdueAmount, 0)
  };

  res.json({ summary, outstanding: result });
});

const getRepPerformance = catchAsync(async (req, res) => {
  const { year, month } = req.query;
  const startDate = new Date(year || new Date().getFullYear(), (month ? month - 1 : 0), 1);
  const endDate = new Date(year || new Date().getFullYear(), (month ? parseInt(month) : 12), 0);

  const reps = await User.findAll({
    where: { role: ['admin', 'user'], active: 1 },
    attributes: ['id', 'firstname', 'lastname', 'email']
  });

  const result = [];
  for (const rep of reps) {
    const orders = await SalesOrder.findAll({
      where: { SalesRepID: rep.id, OrderDate: { [Op.between]: [startDate, endDate] }, isActive: true },
      attributes: ['OrderID', 'TotalAmount', 'PaidAmount', 'PaymentStatus', 'OrderDate']
    });

    const totalSales = orders.reduce((s, o) => s + parseFloat(o.TotalAmount || 0), 0);
    const totalCollected = orders.reduce((s, o) => s + parseFloat(o.PaidAmount || 0), 0);
    const orderCount = orders.length;

    result.push({
      RepID: rep.id,
      Name: `${rep.firstname} ${rep.lastname}`,
      Email: rep.email,
      OrderCount: orderCount,
      TotalSales: totalSales,
      TotalCollected: totalCollected,
      Outstanding: totalSales - totalCollected
    });
  }

  result.sort((a, b) => b.TotalSales - a.TotalSales);
  res.json({ period: { startDate, endDate }, reps: result });
});

module.exports = { getOutstandingBalances, getRepPerformance };
