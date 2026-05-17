import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // You may need to install this package
import Chart from "chart.js";
// import 'chartjs-plugin-datalabels'; // You may need to install this package
import checkToken from "api/checkToken";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { createAxiosInstance } from "api/axiosInstance";

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

export default function ImprovedBarChart() {
  const [inventory, setInventory] = useState([]);
  const [returns, setReturns] = useState([]);
  const [fulfilledSales, setFulfilledSales] = useState([]);
  const [fulfillCounts, setFulfillCounts] = useState([]);
  const [returnCounts, setReturnCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekLabels, setWeekLabels] = useState([]);
  const [totalFulfilled, setTotalFulfilled] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const history = useHistory()
  // const TOKEN = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(localStorage.getItem('user')), c => c.charCodeAt(0)))).tokens.access.token

  async function fetchInventory() {
    setIsLoading(true);
    setError(null);
    try {
      // const inventoryRes = await axios.get(`${BASE_URL}transaction`, {headers:{ Authorization: `Bearer ${TOKEN}` }});

      const api =createAxiosInstance()
      const inventoryRes = await api.get('transaction')

      if (inventoryRes.status === 200) {
        const currentMonth = new Date().getMonth();
        
        const returnTransactions = inventoryRes.data.allTransactions.filter(
          (transaction) => 
            transaction.SalesOrderID != null && 
            transaction.TransactionType === "RETURN" && 
            new Date(transaction.TransactionDate).getMonth() === currentMonth
        );
        
        const fulfillTransactions = inventoryRes.data.allTransactions.filter(
          (transaction) => 
            transaction.SalesOrderID != null && 
            transaction.TransactionType === "FULFILL" && 
            new Date(transaction.TransactionDate).getMonth() === currentMonth
        );
        
        setReturns(returnTransactions);
        setFulfilledSales(fulfillTransactions);
        setInventory(inventoryRes.data.allTransactions);
        
        // Calculate totals
        const totalFulfilled = fulfillTransactions.reduce((sum, tx) => sum + tx.Quantity, 0);
        const totalReturns = returnTransactions.reduce((sum, tx) => sum + tx.Quantity, 0);
        
        setTotalFulfilled(totalFulfilled);
        setTotalReturns(totalReturns);
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "No Transactions Found") {
        console.log("No Transactions Found");
      } else {
        console.log(error)
      }
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {

    // if (checkToken()) {
      fetchInventory()
    // } else {
    //   history.push('/auth/login')
    //   return
    // }

  }, []);

  useEffect(() => {
    if (!inventory.length) return;

    const dates = inventory.map(tx => new Date(tx.TransactionDate));
    const minDate = new Date(Math.min(...dates));
    const year = minDate.getFullYear();
    const month = minDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weekRanges = [];
    for (let startDay = 1; startDay <= daysInMonth; startDay += 7) {
      const endDay = Math.min(startDay + 6, daysInMonth);
      weekRanges.push({
        label: `Week ${weekRanges.length + 1}`,
        start: new Date(year, month, startDay),
        end: new Date(year, month, endDay, 23, 59, 59)
      });
    }

    setWeekLabels(weekRanges.map(range => range.label));

    const fulfillCount = new Array(weekRanges.length).fill(0);
    const returnCount = new Array(weekRanges.length).fill(0);

    inventory.forEach(tx => {
      const txDate = new Date(tx.TransactionDate);
      const qty = tx.Quantity;

      weekRanges.forEach((range, index) => {
        if (txDate >= range.start && txDate <= range.end) {
          if (tx.TransactionType === 'FULFILL' && tx.SalesOrderID != null) {
            fulfillCount[index] += qty;
          } else if (tx.TransactionType === 'RETURN' && tx.SalesOrderID != null) {
            returnCount[index] += qty;
          }
        }
      });
    });

    setFulfillCounts(fulfillCount);
    setReturnCounts(returnCount);
  }, [inventory]);

  useEffect(() => {
    if (!fulfillCounts.length || !returnCounts.length || isLoading) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext("2d");
    
    // Gradient backgrounds
    const fulfillGradient = ctx.createLinearGradient(0, 0, 0, 400);
    fulfillGradient.addColorStop(0, 'rgba(66, 153, 225, 0.9)');    // Blue
    fulfillGradient.addColorStop(1, 'rgba(66, 153, 225, 0.2)');
    
    const returnGradient = ctx.createLinearGradient(0, 0, 0, 400);
    returnGradient.addColorStop(0, 'rgba(245, 101, 101, 0.9)');    // Red
    returnGradient.addColorStop(1, 'rgba(245, 101, 101, 0.2)');
    
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: weekLabels,
        datasets: [
          {
            label: "Fulfilled Orders",
            backgroundColor: fulfillGradient,
            borderColor: "#3182ce",
            borderWidth: 2,
            borderRadius: 6,
            data: fulfillCounts,
            barThickness: 24,
            maxBarThickness: 38,
          },
          {
            label: "Returned Orders",
            backgroundColor: returnGradient,
            borderColor: "#e53e3e",
            borderWidth: 2,
            borderRadius: 6,
            data: returnCounts,
            barThickness: 24,
            maxBarThickness: 38,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          datalabels: {
            display: true,
            color: '#fff',
            font: {
              weight: 'bold',
            },
            formatter: (value) => {
              if (value > 0) return value;
              return '';
            }
          }
        },
        title: {
          display: false,
        },
        tooltips: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0,0,0,0.8)",
          titleFontFamily: "'Inter', sans-serif",
          bodyFontFamily: "'Inter', sans-serif",
          cornerRadius: 6,
          caretSize: 6,
          xPadding: 12,
          yPadding: 12,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        legend: {
          position: "bottom",
          labels: {
            fontColor: "#4a5568",
            boxWidth: 12,
            padding: 20,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            usePointStyle: true,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#718096",
                fontFamily: "'Inter', sans-serif",
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(203, 213, 224, 0.5)",
                zeroLineColor: "rgba(203, 213, 224, 0.5)",
              },
              ticks: {
                padding: 20,
                fontColor: "#718096",
                fontFamily: "'Inter', sans-serif",
                beginAtZero: true,
                callback: function(value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                  return "";
                }
              },
            },
          ],
        },
      },
    });
    
  }, [fulfillCounts, returnCounts, weekLabels, isLoading]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden mt-32"
    >
      {/* Header */}
      <div className="p-4 ">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h2 className=" text-xl font-bold mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Monthly Orders Analysis
            </h2>
            <p className=" text-sm">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50 border-b">
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Fulfilled</p>
            <p className="text-2xl font-bold text-gray-900">{isLoading ? "-" : totalFulfilled}</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Returns</p>
            <p className="text-2xl font-bold text-gray-900">{isLoading ? "-" : totalReturns}</p>
          </div>
        </div>
      </div> */}
      
      {/* Chart */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-red-500 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
              <button 
                onClick={fetchInventory}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ height: "380px" }}>
            <canvas ref={chartRef}></canvas>
          </div>
        )}
      </div>
    </motion.div>
  );
}