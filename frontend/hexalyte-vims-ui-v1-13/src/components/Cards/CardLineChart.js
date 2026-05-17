import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import checkToken from "api/checkToken";
import { createAxiosInstance } from "api/axiosInstance";

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

export default function ModernSalesChart() {
  const [sales, setSales] = useState([]);
  const [monthlySales, setMonthlySales] = useState(Array(12).fill(0));
  const [isLoading, setIsLoading] = useState(true);
  const [highestMonth, setHighestMonth] = useState({ month: "", value: 0 });
  const [totalSales, setTotalSales] = useState(0);
  const [comparedToLastYear, setComparedToLastYear] = useState(10); // Example value (percentage)
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const history = useHistory()
  // const TOKEN = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(localStorage.getItem('user')), c => c.charCodeAt(0)))).tokens.access.token

  async function fetchSales() {
    setIsLoading(true);
    try {
      // const salesRes = await axios.get(`${BASE_URL}salesorder`, {headers:{ Authorization: `Bearer ${TOKEN}` }});

      const api = createAxiosInstance()
      const salesRes = await api.get('salesorder')

      if (salesRes.status === 200) {
        setSales(salesRes.data.salesorders);
      }
    } catch (error) {
      // "no sales orders found"

      if (error.status === 404 && error.response.data.message === "no sales orders found") {
        console.log("no sales orders found");
      } else {
        console.log(error)
      }

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {

    // if (checkToken()) {
      fetchSales();

      // Add window resize handler for responsiveness
      const handleResize = () => {
        if (chartInstance.current) {
          // Force recreation of chart on window resize for better mobile display
          chartInstance.current.destroy();
          // Create a shallow copy to trigger the chart recreation
          const currentMonthlySales = [...monthlySales];
          setMonthlySales(currentMonthlySales);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    // } else {
    //   history.push('/auth/login')
    //   return
    // }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sales.length) return;

    const monthlyTotals = Array(12).fill(0);
    let total = 0;
    let highest = { month: "", value: 0 };
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    sales.forEach(order => {
      const orderDate = new Date(order.OrderDate);
      if (isNaN(orderDate.getTime())) {
        return; // Skip invalid dates
      }

      const month = orderDate.getMonth(); // 0 = Jan
      const amount = parseFloat(order.TotalAmount) || 0;
      monthlyTotals[month] += amount;
      total += amount;

      if (monthlyTotals[month] > highest.value) {
        highest = { month: monthNames[month], value: monthlyTotals[month] };
      }
    });

    setMonthlySales(monthlyTotals);
    setTotalSales(total);
    setHighestMonth(highest);
  }, [sales]);

  useEffect(() => {
    if (!chartRef.current || isLoading) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // Detect if we're on mobile
    const isMobile = window.innerWidth < 640;

    // Create gradient for the area fill
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, "rgba(0, 123, 255, 0.3)");
    gradientFill.addColorStop(1, "rgba(0, 123, 255, 0.0)");

    // Create gradient for the bar background
    const barGradient = ctx.createLinearGradient(0, 0, 0, 400);
    barGradient.addColorStop(0, "rgba(0, 123, 255, 0.9)");
    barGradient.addColorStop(1, "rgba(0, 123, 255, 0.6)");

    // Create a const for tooltip callback configuration
    const tooltipCallback = {
      label: function (context) {
        return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(context.raw)}`;
      }
    };

    const config = {
      type: "bar", // Changed to bar chart
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: [
          {
            type: "line",
            label: "Trend",
            backgroundColor: gradientFill,
            borderColor: "rgba(0, 123, 255, 1)",
            borderWidth: isMobile ? 2 : 3,
            pointBackgroundColor: "#fff",
            pointBorderColor: "rgba(0, 123, 255, 1)",
            pointRadius: isMobile ? 4 : 6,
            pointHoverRadius: isMobile ? 6 : 8,
            tension: 0.4,
            data: monthlySales,
            fill: true,
            order: 0 // This ensures the line appears above the bars
          },
          {
            type: "bar",
            label: "Monthly Sales",
            backgroundColor: barGradient,
            borderRadius: 6,
            data: monthlySales,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            order: 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: isMobile ? 'bottom' : 'top',
            align: 'center',
            labels: {
              font: {
                size: isMobile ? 12 : 14,
                family: "'Poppins', sans-serif",
                weight: '600'
              },
              usePointStyle: true,
              pointStyleWidth: isMobile ? 10 : 12,
              boxWidth: isMobile ? 10 : 12,
              padding: isMobile ? 15 : 20,
              color: '#333'
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: isMobile ? 14 : 16,
              family: "'Poppins', sans-serif",
              weight: '600'
            },
            bodyFont: {
              size: isMobile ? 12 : 14,
              family: "'Poppins', sans-serif"
            },
            padding: isMobile ? 8 : 12,
            cornerRadius: 6,
            displayColors: !isMobile,
            callbacks: tooltipCallback
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: isMobile ? 10 : 13,
                family: "'Poppins', sans-serif",
                weight: '500'
              },
              color: '#666',
              padding: 10,
              maxRotation: isMobile ? 45 : 0,
              autoSkip: true,
              autoSkipPadding: isMobile ? 5 : 10
            },
            border: {
              display: false
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.06)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: isMobile ? 11 : 14,
                family: "'Poppins', sans-serif",
                weight: '500'
              },
              color: '#666',
              padding: isMobile ? 6 : 10,
              callback: function (value) {
                if (value >= 1000000) {
                  return '$' + (value / 1000000).toFixed(isMobile ? 0 : 1) + 'M';
                } else if (value >= 1000) {
                  return '$' + (value / 1000).toFixed(isMobile ? 0 : 1) + 'K';
                }
                return '$' + value;
              },
              maxTicksLimit: isMobile ? 4 : 5
            },
            beginAtZero: true,
            border: {
              display: false
            }
          }
        }
      }
    };

    try {
      chartInstance.current = new Chart(ctx, config);
    } catch (error) {
      console.error("Error creating chart:", error);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlySales, isLoading]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden mt-32">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-2 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-bold mt-1">Sales Overview</h2>
          </div>
          {/* <button 
            onClick={fetchSales} 
            className="bg-white text-blue-600 hover:bg-blue-50 px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm transition-all"
          >
            Refresh
          </button> */}
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-5">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <p className="text-white text-opacity-70 text-xs sm:text-sm mb-1">Total Sales</p>
            <h3 className="text-xl sm:text-2xl font-bold">{formatCurrency(totalSales)}</h3>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <p className="text-white text-opacity-70 text-xs sm:text-sm mb-1">Best Month</p>
            <h3 className="text-xl sm:text-2xl font-bold">{highestMonth.month}</h3>
            <p className="text-xs sm:text-sm mt-1 font-medium">{formatCurrency(highestMonth.value)}</p>
          </div>
        </div> */}
      </div>

      {/* Chart */}
      <div className="p-3 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-60 sm:h-80">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-60 sm:h-80">
            <canvas ref={chartRef}></canvas>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 bg-gray-800 text-white text-xs font-medium flex flex-col sm:flex-row justify-between">
        <span className="mb-1 sm:mb-0">Last updated: {new Date().toLocaleString()}</span>
        <span className="text-blue-300">2025 Fiscal Year</span>
      </div>
    </div>
  );
}