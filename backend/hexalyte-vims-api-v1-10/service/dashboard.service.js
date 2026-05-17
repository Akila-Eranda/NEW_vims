const db = require('../models');
const { Op } = require('sequelize');

const Customer = db.customer;
const Salesorder = db.salesorder;
const Product = db.product;
const ProductStorage = db.productstorage;
const SalesorderDetail = db.salesorderdetail;

/**
 * Get comprehensive dashboard statistics
 * Returns all dashboard data in a single API call
 */
const getDashboardStats = async () => {
  try {
    // Get date ranges for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel queries for better performance
    const [
      ordersData,
      customersData,
      productsData,
      productStorageData,
      recentOrders,
      recentCustomers
    ] = await Promise.all([
      // Orders statistics
      Salesorder.findAll({
        where: { isActive: 1 },
        attributes: [
          'OrderID',
          'OrderDate',
          'TotalAmount',
          'Status',
          'PaymentStatus'
        ]
      }),

      // Customers statistics
      Customer.findAll({
        attributes: [
          'CustomerID',
          'Name',
          'isActive',
          'createdAt'
        ]
      }),

      // Products for inventory value
      Product.findAll({
        attributes: [
          'ProductID',
          'Name',
          'SellingPrice',
          'QuantityInStock'
        ]
      }),

      // Product storage for stock details
      ProductStorage.findAll({
        attributes: [
          'ProductID',
          'Quantity'
        ]
      }),

      // Recent 10 orders
      Salesorder.findAll({
        where: { isActive: 1 },
        order: [['OrderDate', 'DESC']],
        limit: 10,
        attributes: [
          'OrderID',
          'CustomerID',
          'OrderDate',
          'TotalAmount',
          'Status',
          'PaymentStatus'
        ]
      }),

      // Recent 5 customers
      Customer.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: [
          'CustomerID',
          'Name',
          'Email',
          'Phone',
          'isActive',
          'createdAt'
        ]
      })
    ]);

    // Calculate order statistics
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(o => 
      ['PENDING', 'SUBMITTED', 'NEW'].includes(o.Status?.toUpperCase())
    ).length;
    const completedOrders = ordersData.filter(o => 
      ['COMPLETED', 'DELIVERED', 'FINISHED'].includes(o.Status?.toUpperCase())
    ).length;
    const cancelledOrders = ordersData.filter(o => 
      o.Status?.toUpperCase() === 'CANCELLED'
    ).length;

    // Calculate revenue from inventory (selling price × stock)
    const totalRevenue = productsData.reduce((sum, product) => {
      return sum + (parseFloat(product.SellingPrice || 0) * parseFloat(product.QuantityInStock || 0));
    }, 0);

    // Calculate customer statistics
    const totalCustomers = customersData.length;
    const activeCustomers = customersData.filter(c => c.isActive === true || c.isActive === 1).length;
    const inactiveCustomers = totalCustomers - activeCustomers;
    const newCustomersThisMonth = customersData.filter(c => 
      c.createdAt && new Date(c.createdAt) >= startOfMonth
    ).length;

    // Calculate inventory statistics
    const totalProducts = productsData.length;
    const lowStockProducts = productsData.filter(p => 
      parseFloat(p.QuantityInStock || 0) < 10 && parseFloat(p.QuantityInStock || 0) > 0
    );
    const outOfStockProducts = productsData.filter(p => 
      parseFloat(p.QuantityInStock || 0) === 0
    ).length;

    // Calculate last month data for change percentages
    const lastMonthOrders = ordersData.filter(o => {
      const orderDate = new Date(o.OrderDate);
      return orderDate >= startOfLastMonth && orderDate <= endOfLastMonth;
    }).length;

    const lastMonthCustomers = customersData.filter(c => {
      if (!c.createdAt) return false;
      const createdDate = new Date(c.createdAt);
      return createdDate >= startOfLastMonth && createdDate <= endOfLastMonth;
    }).length;

    // Calculate percentage changes
    const ordersChange = lastMonthOrders > 0 
      ? ((totalOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
      : 0;
    const customersChange = lastMonthCustomers > 0
      ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers * 100).toFixed(1)
      : 0;

    // Return comprehensive dashboard data
    return {
      revenue: {
        total: parseFloat(totalRevenue.toFixed(2)),
        change: 0, // Can be calculated if you have historical data
        inventoryValue: parseFloat(totalRevenue.toFixed(2))
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        change: parseFloat(ordersChange)
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        inactive: inactiveCustomers,
        newThisMonth: newCustomersThisMonth,
        change: parseFloat(customersChange)
      },
      inventory: {
        totalItems: totalProducts,
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts,
        change: 0 // Can be calculated if you track inventory changes
      },
      recentOrders: recentOrders.map(order => ({
        orderID: order.OrderID,
        customerID: order.CustomerID,
        orderDate: order.OrderDate,
        totalAmount: parseFloat(order.TotalAmount || 0),
        status: order.Status,
        paymentStatus: order.PaymentStatus
      })),
      recentCustomers: recentCustomers.map(customer => ({
        customerID: customer.CustomerID,
        name: customer.Name,
        email: customer.Email,
        phone: customer.Phone,
        isActive: customer.isActive,
        createdAt: customer.createdAt
      })),
      lowStockProducts: lowStockProducts.slice(0, 5).map(product => ({
        productID: product.ProductID,
        name: product.Name,
        quantityInStock: parseFloat(product.QuantityInStock || 0)
      }))
    };

  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

/**
 * Get analytics data for charts including sales trends, revenue trends, etc.
 */
const getAnalyticsData = async () => {
  try {
    const now = new Date();
    const last12Months = new Date();
    last12Months.setMonth(now.getMonth() - 12);

    // Get sales data for the last 12 months
    const salesData = await Salesorder.findAll({
      where: {
        isActive: 1,
        OrderDate: {
          [Op.gte]: last12Months
        }
      },
      attributes: ['OrderDate', 'TotalAmount', 'Status'],
      order: [['OrderDate', 'ASC']]
    });

    // Group sales by month
    const monthlyData = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months to 0
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - 11 + i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = { sales: 0, revenue: 0, orders: 0 };
    }

    // Populate with actual data
    salesData.forEach(order => {
      const date = new Date(order.OrderDate);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].orders += 1;
        monthlyData[monthKey].revenue += parseFloat(order.TotalAmount || 0);
        if (['COMPLETED', 'DELIVERED', 'FINISHED'].includes(order.Status?.toUpperCase())) {
          monthlyData[monthKey].sales += parseFloat(order.TotalAmount || 0);
        }
      }
    });

    // Convert to arrays for chart data
    const labels = Object.keys(monthlyData);
    const salesChartData = labels.map(month => monthlyData[month].sales);
    const revenueChartData = labels.map(month => monthlyData[month].revenue);
    const ordersChartData = labels.map(month => monthlyData[month].orders);

    return {
      salesTrend: {
        labels: labels,
        sales: salesChartData,
        revenue: revenueChartData,
        orders: ordersChartData
      }
    };

  } catch (error) {
    console.error('Error getting analytics data:', error);
    throw error;
  }
};

/**
 * Get top selling products
 */
const getTopProducts = async (limit = 10) => {
  try {
    // Get product sales data by joining with sales order details
    const topProducts = await SalesorderDetail.findAll({
      attributes: [
        'ProductID',
        [db.sequelize.fn('SUM', db.sequelize.col('Quantity')), 'totalQuantitySold'],
        [db.sequelize.fn('SUM', db.sequelize.literal('Quantity * UnitPrice')), 'totalRevenue']
      ],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['Name', 'SellingPrice']
      }],
      group: ['ProductID'],
      order: [[db.sequelize.literal('totalRevenue'), 'DESC']],
      limit: limit
    });

    return topProducts.map(item => ({
      productID: item.ProductID,
      productName: item.product?.Name || 'Unknown Product',
      quantitySold: parseInt(item.getDataValue('totalQuantitySold') || 0),
      totalRevenue: parseFloat(item.getDataValue('totalRevenue') || 0),
      sellingPrice: parseFloat(item.product?.SellingPrice || 0)
    }));

  } catch (error) {
    console.error('Error getting top products:', error);
    throw error;
  }
};

/**
 * Get best customers based on purchase amount
 */
const getBestCustomers = async (limit = 10) => {
  try {
    // Get customer purchase data
    const bestCustomers = await Salesorder.findAll({
      attributes: [
        'CustomerID',
        [db.sequelize.fn('COUNT', db.sequelize.col('OrderID')), 'totalOrders'],
        [db.sequelize.fn('SUM', db.sequelize.col('TotalAmount')), 'totalSpent'],
        [db.sequelize.fn('AVG', db.sequelize.col('TotalAmount')), 'avgOrderValue']
      ],
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['Name', 'Email', 'Phone']
      }],
      where: { isActive: 1 },
      group: ['CustomerID'],
      order: [[db.sequelize.literal('totalSpent'), 'DESC']],
      limit: limit
    });

    return bestCustomers.map(item => ({
      customerID: item.CustomerID,
      customerName: item.customer?.Name || 'Unknown Customer',
      email: item.customer?.Email,
      phone: item.customer?.Phone,
      totalOrders: parseInt(item.getDataValue('totalOrders') || 0),
      totalSpent: parseFloat(item.getDataValue('totalSpent') || 0),
      avgOrderValue: parseFloat(item.getDataValue('avgOrderValue') || 0)
    }));

  } catch (error) {
    console.error('Error getting best customers:', error);
    throw error;
  }
};

/**
 * Get daily revenue data for the last 30 days
 */
const getDailyRevenue = async () => {
  try {
    const now = new Date();
    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    // Get sales data for the last 30 days
    const salesData = await Salesorder.findAll({
      where: {
        isActive: 1,
        OrderDate: {
          [Op.gte]: last30Days
        }
      },
      attributes: ['OrderDate', 'TotalAmount', 'Status'],
      order: [['OrderDate', 'ASC']]
    });

    // Group sales by day
    const dailyData = {};
    
    // Initialize all days to 0
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      dailyData[dateKey] = { 
        revenue: 0, 
        orders: 0,
        displayDate: `${date.getDate()}/${date.getMonth() + 1}`
      };
    }

    // Populate with actual data
    salesData.forEach(order => {
      const date = new Date(order.OrderDate);
      const dateKey = date.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].orders += 1;
        dailyData[dateKey].revenue += parseFloat(order.TotalAmount || 0);
      }
    });

    // Convert to arrays for chart data
    const dates = Object.keys(dailyData).sort();
    const labels = dates.map(date => dailyData[date].displayDate);
    const revenueData = dates.map(date => dailyData[date].revenue);
    const ordersData = dates.map(date => dailyData[date].orders);

    // Calculate totals
    const totalRevenue = revenueData.reduce((sum, val) => sum + val, 0);
    const totalOrders = ordersData.reduce((sum, val) => sum + val, 0);
    const avgDailyRevenue = totalRevenue / 30;

    return {
      dailyRevenue: {
        labels: labels,
        revenue: revenueData,
        orders: ordersData,
        totalRevenue: totalRevenue,
        totalOrders: totalOrders,
        avgDailyRevenue: avgDailyRevenue
      }
    };

  } catch (error) {
    console.error('Error getting daily revenue:', error);
    throw error;
  }
};

module.exports = {
  getDashboardStats,
  getAnalyticsData,
  getTopProducts,
  getBestCustomers,
  getDailyRevenue
};
