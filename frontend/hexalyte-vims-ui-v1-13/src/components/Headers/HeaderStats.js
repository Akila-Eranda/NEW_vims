import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, BarChart2, RefreshCw } from "lucide-react";
import checkToken from "api/checkToken";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { createAxiosInstance } from "api/axiosInstance";

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

export default function ModernHeaderStats() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [returns, setReturns] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [fulfilledSales, setFulfilledSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory()

  async function fetchSales() {
    try {
      // const salesOrdersRes = await axios.get(`${BASE_URL}salesorder`, { headers: { Authorization: `Bearer ${TOKEN}` } });
      // if (salesOrdersRes.status === 200) {
      //   setSalesOrders(salesOrdersRes.data.salesorders);
      // }

      const api = createAxiosInstance()
      const salesOrdersRes = await api.get('salesorder')
      if (salesOrdersRes.status === 200) {
        setSalesOrders(salesOrdersRes.data.salesorders);
      }

    } catch (error) {
      if (error.status === 404 && error.response.data.message === "no sales orders found") {
        console.log("No sales orders found");
      } else {
        console.log(error)
      }
    }
  }

  async function fetchInventory() {
    try {
      // const inventoryRes = await axios.get(`${BASE_URL}transaction`, { headers: { Authorization: `Bearer ${TOKEN}` } });

      const api = createAxiosInstance()
      const inventoryRes = await api.get('transaction')

      if (inventoryRes.status === 200) {
        setReturns(inventoryRes.data.allTransactions.filter(
          (transaction) => transaction.SalesOrderID != null && transaction.TransactionType === "RETURN"
        ).length);

        setFulfilledSales(inventoryRes.data.allTransactions.filter(
          (transaction) => transaction.SalesOrderID != null && transaction.TransactionType === "FULFILL"
        ));

        setInventory(inventoryRes.data.allTransactions);
      }
    } catch (error) {
      // "No Transactions Found"
      if (error.status === 404 && error.response.data.message === "No Transactions Found") {
        console.log("No Transactions Found");
      } else {
        console.log(error)
      }
    }
  }

  async function fetchProducts() {
    try {
      // const ProductRes = await axios.get(`${BASE_URL}product`, { headers: { Authorization: `Bearer ${TOKEN}` } });

      const api = createAxiosInstance()
      const ProductRes = await api.get('product')

      if (ProductRes.status === 200) {
        setProducts(ProductRes.data.allProducts);
      }
    } catch (error) {
      // "No Products Found"
      if (error.status === 404 && error.response.data.message === "No Products Found") {
        console.log("No Products Found");
      } else {
        console.log(error)
      }
    }
  }

  async function calculateProfit() {
    try {
      const totalCost = fulfilledSales.reduce((sum, row) => {
        const product = products.find(
          (product) => product.ProductID.toString() === row.ProductID.toString()
        );
        return sum + (Number(product?.BuyingPrice || 0) * row.Quantity);
      }, 0);

      const totalRevenue = fulfilledSales.reduce((sum, row) => {
        const product = products.find(
          (product) => product.ProductID.toString() === row.ProductID.toString()
        );
        return sum + (Number(product?.SellingPrice || 0) * row.Quantity);
      }, 0);

      const totalDiscounts = salesOrders.reduce(
        (sum, row) => sum + Number(row.Discount || 0),
        0
      );

      setTotalProfit(totalRevenue - (totalCost + totalDiscounts));
    } catch (error) {
      console.error("Error calculating profit:", error);
    }
  }

  async function calculateTotalSales() {
    try {
      let salesOrderIDs = [];

      const totalSales = fulfilledSales.reduce((sum, row) => {
        const salesOrder = salesOrders.find(
          (order) => order.OrderID.toString() === row.SalesOrderID.toString()
        );

        if (salesOrder && !salesOrderIDs.includes(salesOrder.OrderID)) {
          salesOrderIDs.push(salesOrder.OrderID);
          return sum + Number(salesOrder.TotalAmount || 0);
        }

        return sum;
      }, 0);

      setTotalSales(totalSales);
    } catch (error) {
      console.error("Error calculating total sales:", error);
    }
  }

  async function refreshData() {
    setIsLoading(true);
    await Promise.all([
      fetchSales(),
      fetchInventory(),
      fetchProducts()
    ]);
    setIsLoading(false);
  }

  useEffect(() => {

    // if (checkToken()) {
      refreshData();
    // } else {
    //   history.push('/auth/login')
    //   return
    // }

  }, []);

  useEffect(() => {
    if (salesOrders.length && fulfilledSales.length && products.length) {
      setTotalOrders(salesOrders.length);
      calculateProfit();
      calculateTotalSales();
      setIsLoading(false);
    }
  }, [salesOrders, fulfilledSales, products]);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate percentage change (hardcoded for now)
  // const getStatData = (type) => {
  //   switch (type) {
  //     case 'sales':
  //       return { percent: 3.48, isPositive: true };
  //     case 'orders':
  //       return { percent: 3.48, isPositive: false };
  //     case 'profit':
  //       return { percent: 1.10, isPositive: false };
  //     case 'returns':
  //       return { percent: 12, isPositive: true };
  //     default:
  //       return { percent: 0, isPositive: true };
  //   }
  // };

  // Stat card component
  const StatCard = ({ title, value, icon, type, className }) => {
    // const statData = getStatData(type);

    return (
      <div className={`rounded-xl bg-white shadow-lg p-6 relative overflow-hidden ${className}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>

            <div className="flex items-center mt-3">
              {/* <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${statData.isPositive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                {statData.isPositive ?
                  <ArrowUpRight size={12} className="mr-1" /> :
                  <ArrowDownRight size={12} className="mr-1" />
                }
                {statData.percent}%
              </div> */}
              {/* <span className="text-xs text-gray-500 ml-2">vs. last period</span> */}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${getIconBgColor(type)}`}>
            {icon}
          </div>
        </div>
        <div className={`absolute -right-3 -bottom-8 rounded-full w-24 h-24 opacity-10 ${getIconBgColor(type)}`}></div>
      </div>
    );
  };

  // Get icon background color based on type
  const getIconBgColor = (type) => {
    switch (type) {
      case 'sales': return 'bg-blue-500 text-white';
      case 'orders': return 'bg-indigo-500 text-white';
      case 'profit': return 'bg-green-500 text-white';
      case 'returns': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-b-3xl pt-6 pb-20">
        <div className="px-4 md:px-8 mx-auto w-full relative ">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white text-3xl font-bold">Dashboard Overview</h1>
            {/* <button 
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-all duration-200"
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button> */}
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-10 w-56 h-56 bg-white opacity-10 rounded-full"></div>
          <div className="absolute left-20 bottom-0 w-36 h-36 bg-white opacity-10 rounded-full"></div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 md:px-8 mx-auto w-full -mt-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Sales"
            value={isLoading ? "Loading..." : formatCurrency(totalSales)}
            type="sales"
            icon={<BarChart2 size={20} />}
          />
          <StatCard
            title="Total Orders"
            value={isLoading ? "Loading..." : totalOrders}
            type="orders"
            icon={<ShoppingCart size={20} />}
          />
          <StatCard
            title="Total Profit"
            value={isLoading ? "Loading..." : formatCurrency(totalProfit)}
            type="profit"
            icon={<DollarSign size={20} />}
          />
          <StatCard
            title="Returns"
            value={isLoading ? "Loading..." : returns}
            type="returns"
            icon={<RefreshCw size={20} />}
          />
        </div>
      </div>
    </div>
  );
}