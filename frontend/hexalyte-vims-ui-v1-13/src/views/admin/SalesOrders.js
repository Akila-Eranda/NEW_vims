import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import SalesOrderAddModal from "components/Modal/SalesOrderAddModal";
import SalesOrderEditModal from "components/Modal/SalesOrderEditModal";
import SalesOrderInfoModal from "../../components/Modal/SalesOrderInfoModal";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import handlePrint from "components/Print/handlePrint";
import handlePrintSalesOrderTable from "components/Print/handlePrintSalesOrderTable";
import PaymentActionButton from "components/buttons/PaymentActionButton";
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

const TOKEN = localStorage.getItem('user') ? JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(localStorage.getItem('user')), c => c.charCodeAt(0)))).tokens.access.token : null

function SalesOrders() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [openSalesOrderDetailModal, setOpenSalesOrderDetailModal] = useState(null);
  const [opnEditSalesOrderModal, setOpenEditSalesOrderModal] = useState(false);
  const [openAddSalesOrderModal, setOpenAddSalesOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState('');

  const printOrder = async (order) => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const orderDate = new Date(order.OrderDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const api = createAxiosInstance()
    const orderItemsRes = await api.get(`salesorderdetails/${order.OrderID}`) || []

    const orderItems = orderItemsRes.data.data || []

    const orderRows = orderItems.map((orderItem) => {

      return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">#${orderItem.ProductId}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderItem.product.Name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderItem.Quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${Number(orderItem.UnitPrice)?.toLocaleString() || '0'} LKR</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${((Number(orderItem.UnitPrice)) * Number(orderItem.Quantity))?.toLocaleString() || '0'} LKR</td>
          </tr>
        `

    }).join('')


    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sales Order #${order.OrderID}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 15px;
              color: #333;
              line-height: 1.4;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              padding: 15px;
              border-radius: 4px;
              box-shadow: 0 1px 5px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2d5a27;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .document-title {
              font-size: 24px;
              font-weight: bold;
              color: #2d5a27;
              margin-bottom: 5px;
              letter-spacing: 1px;
            }
            .company-name {
              font-size: 16px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 3px;
            }
            .company-details {
              font-size: 10px;
              color: #374151;
              margin-bottom: 3px;
            }
            .order-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              background: #f8f9fa;
              padding: 12px;
              border-radius: 4px;
            }
            .order-details {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            .order-number {
              font-size: 14px;
              font-weight: bold;
              color: #1f2937;
            }
            .order-date {
              color: #6b7280;
              font-size: 12px;
            }
            .payment-method {
              color: #6b7280;
              font-size: 12px;
            }
            .amount-due {
              text-align: right;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 3px;
            }
            .amount-label {
              font-size: 12px;
              color: #6b7280;
              font-weight: 600;
            }
            .amount-value {
              font-size: 18px;
              font-weight: bold;
              color: #1e40af;
            }
            .billing-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            }
            .billing-info {
              flex: 1;
            }
            .billing-title {
              font-weight: bold;
              font-size: 14px;
              color: #1f2937;
              margin-bottom: 5px;
            }
            .billing-details {
              font-size: 12px;
              color: #4b5563;
              line-height: 1.4;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
              background: white;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .items-table th {
              background: #f8f9fa;
              padding: 8px 6px;
              text-align: left;
              font-weight: 600;
              color: #374151;
              border-bottom: 1px solid #e5e7eb;
              font-size: 12px;
            }
            .items-table td {
              padding: 6px;
              border-bottom: 1px solid #f3f4f6;
              font-size: 12px;
            }
            .items-table tr:last-child td {
              border-bottom: none;
            }
            .items-table tr:hover {
              background: #f9fafb;
            }
            .quantity-cell {
              text-align: center;
              font-weight: 600;
            }
            .price-cell {
              text-align: right;
              font-weight: 600;
            }
            .total-cell {
              text-align: right;
              font-weight: bold;
              color: #1e40af;
            }
            .totals-section {
              margin-left: auto;
              width: 250px;
              border-top: 1px solid #e5e7eb;
              padding-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              font-size: 12px;
            }
            .total-row.subtotal {
              color: #6b7280;
            }
            .total-row.tax {
              color: #6b7280;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 6px;
              margin-bottom: 6px;
            }
            .total-row.final {
              font-size: 14px;
              font-weight: bold;
              color: #1f2937;
              border-top: 1px solid #1f2937;
              padding-top: 6px;
            }
            .status-badge {
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              display: inline-block;
            }
            .status-completed { background: #d1fae5; color: #065f46; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-cancelled { background: #fee2e2; color: #991b1b; }
            .status-paid { background: #d1fae5; color: #065f46; }
            .status-unpaid { background: #fee2e2; color: #991b1b; }
            .thank-you {
              text-align: center;
              margin-top: 20px;
              padding: 12px;
              background: #f8f9fa;
              border-radius: 4px;
            }
            .thank-you-title {
              font-size: 18px;
              font-weight: bold;
              color: #2d5a27;
              margin-bottom: 5px;
            }
            .thank-you-message {
              font-size: 11px;
              color: #6b7280;
              line-height: 1.4;
            }
            .footer {
              margin-top: 15px;
              border-top: 1px solid #e5e7eb;
              padding-top: 10px;
              text-align: center;
              color: #6b7280;
              font-size: 10px;
            }
            .print-date {
              text-align: right;
              font-size: 10px;
              color: #6b7280;
              margin-bottom: 10px;
            }
            @media print {
              body { 
                margin: 10px;
                background: white;
              }
              .container {
                box-shadow: none;
                padding: 0;
              }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="print-date">Printed on: ${currentDate}</div>
            
            <div class="header">
              <div class="document-title">SALES ORDER</div>
              <div class="company-name">Ashoka Rubber Industries</div>
              <div class="company-details"><strong>DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEERING HOSE</strong></div>
              <div class="company-details">No. 89, Ruwanpura, Hapugasthalawa, Tel: 0776 272 994, 0779 626 642</div>
            </div>
  
            <div class="order-header">
              <div class="order-details">
                <div class="order-number">PURCHASE ORDER: #${order.OrderID}</div>
                <div class="order-date">DATE: ${orderDate}</div>
              </div>
              <div class="amount-due">
                <div class="amount-label">AMOUNT DUE</div>
                <div class="amount-value">${Number(order.TotalAmount)?.toLocaleString() || '0'} LKR</div>
              </div>
            </div>
  
  
  
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                ${orderRows}
              </tbody>
            </table>
  
            <div class="totals-section">
              <div class="total-row subtotal">
                <span>SUBTOTAL</span>
                <span>${Number(order.SubTotal || order.TotalAmount)?.toLocaleString() || '0'} LKR</span>
              </div>
              <div class="total-row final">
                <span>TOTAL</span>
                <span>${Number(order.TotalAmount)?.toLocaleString() || '0'} LKR</span>
              </div>
            </div>
  
            <div class="thank-you">
              <div class="thank-you-title">THANK YOU!</div>
              <div class="thank-you-message">
                Thank you for your business. We appreciate your trust in our quality rubber products and look forward to serving you again.
              </div>
            </div>
  
            <div class="footer">
              <p>This is a computer-generated document. No signature is required.</p>
              <p>Purchase Order #${order.OrderID} | Generated on ${currentDate}</p>
              <p>Payment Status: <span class="status-badge status-${order.Status?.toLowerCase() || 'unpaid'}">${order.Status || 'Unpaid'}</span></p>
            </div>
          </div>
  
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };


  async function loadSalesOrders() {

    // if (checkToken()) {
    try {
      setIsLoading(true);
      // const response = await axios.get(`${BASE_URL}salesorder`, {headers:{ Authorization: `Bearer ${TOKEN}` }});

      const api = createAxiosInstance()
      const response = await api.get('salesorder')

      if (response.status === 200) {
        // setSalesOrders(() => response.data.salesorders);

        setSalesOrders(() => response.data.salesorders.filter(order => order.isActive !== false));

      }
      setIsLoading(false);
    } catch (error) {
      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   localStorage.clear();
      //   history.push('/auth/login');
      // }
      if (error.status === 404 && error.response.data.message === "no sales orders found") {
        console.log("No Sales Orders Found")
      } else {
        console.log(error)
      }
      setIsLoading(false);
    }

    // } else {
    //   history.push('/auth/login');
    // }

  }

  async function updatePaymentStatus(order) {
    try {
      const result = await Swal.fire({
        title: "Update Payment Status",
        text: `Mark this order as Paid?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#74BF04",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Yes, mark as Paid`,
      });

      if (result.isConfirmed) {

        const newStatus = {
          CustomerID: order.CustomerID,
          OrderDate: order.OrderDate,
          TotalAmount: order.TotalAmount,
          Discount: order.Discount,
          DiscountID: order.DiscountID,
          Status: order.Status,
          LocationID: order.LocationID,
          PaymentStatus: 'PAID',
        }

        // const updateReq = await axios.put(
        //   `${BASE_URL}salesorder/${order.OrderID}`,
        //   newStatus,
        //   {headers:{ Authorization: `Bearer ${TOKEN}` }}
        // );

        const api = createAxiosInstance();
        const updateReq = await api.put(`salesorder/${order.OrderID}`, newStatus)

        // console.log(updateReq)

        if (updateReq.status === 200) {
          loadSalesOrders()

          Swal.fire({
            title: "Updated!",
            text: `Payment status has been updated to Paid.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update payment status. Please try again.",
        icon: "error",
      });
    }
  }


  const filteredOrders = salesOrders.filter(order => {
    // Search query filter (Order ID or Status)
    const matchesSearch = !searchQuery ||
      order.OrderID.toString().includes(searchQuery) ||
      (order.Status && order.Status.toLowerCase().includes(searchQuery.toLowerCase()));

    // Date filter
    const matchesDate = !date ||
      new Date(order.OrderDate).toDateString() === new Date(date).toDateString();

    return matchesSearch && matchesDate;
  });

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        borderRadius: "8px 8px 0 0",
        border: "none",
        minHeight: "56px",
      },
    },
    headCells: {
      style: {
        color: "#4b5563",
        fontSize: "14px",
        fontWeight: "600",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "60px",
        borderBottom: "1px solid #f3f4f6",
        "&:last-of-type": {
          borderBottom: "none",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f3f4f6",
        cursor: "pointer",
        transitionDuration: "0.15s",
        transitionProperty: "background-color",
        borderBottomColor: "#f3f4f6",
        outlineColor: "transparent",
      },
    },
    pagination: {
      style: {
        border: "none",
        backgroundColor: "#fff",
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  };

  const StatusBadge = ({ status }) => {
    let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";

    if (status.toLowerCase() === "completed") {
      badgeClass += "bg-green-100 text-green-800";
    } else if (status.toLowerCase() === "pending") {
      badgeClass += "bg-yellow-100 text-yellow-800";
    } else if (status.toLowerCase() === "cancelled") {
      badgeClass += "bg-red-100 text-red-800";
    } else {
      badgeClass += "bg-blue-100 text-blue-800";
    }

    return <span className={badgeClass}>{status}</span>;
  };

  const columns = [
    {
      name: "Order ID",
      selector: row => row.OrderID,
      sortable: true,
      style: {
        fontWeight: 600,
        color: "#1f2937",
      },
    },
    {
      name: "Order Date",
      selector: row => {
        const date = new Date(row.OrderDate);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
      sortable: true,
      style: {
        color: "#6b7280",
      },
    },
    {
      name: "Total Amount",
      selector: row => {
        return (
          <span className="font-semibold text-gray-800">
            {row.TotalAmount.toLocaleString()} LKR
          </span>
        );
      },
      sortable: true,
      style: {
        color: "#374151",
      },
    },
    {
      name: "Status",
      selector: row => <StatusBadge status={row.Status} />,
      sortable: true,
    },
    {
      name: "Payment Status",
      selector: row => <PaymentActionButton order={row} updatePaymentStatus={updatePaymentStatus} orderType="SalesOrder" />,
      sortable: true,
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            // onClick={() => printHandler()}
            onClick={() => handlePrint(row)}
            title="Print Receipt"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
          <button
            className="bg-purple-500 text-white rounded-full p-2 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              printOrder(row);
            }}
            title="Print Order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
          <button
            className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            onClick={() => setOpenSalesOrderDetailModal(row)}
            title="View Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <button
            className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            onClick={() => setOpenEditSalesOrderModal(row)}
            title="Edit Order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          <button
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteSalesOrder(row);
            }}
            title="Delete Order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
      button: `true`,
      width: "120px",
    }
  ];

  useEffect(() => {

    loadSalesOrders();
    return () => { };

  }, []);

  async function deleteSalesOrder(salesOrderRow) {
    try {
      Swal.fire({
        title: "Confirm Delete",
        text: `Are you sure to delete the sales order (ID: ${salesOrderRow.OrderID})?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          async function deleteSalesOrderRequest(order) {
            try {
              // const deleteReq = await axios.delete(
              //   `${BASE_URL}product/${product.ProductID}`, { withCredentials: true }
              // );

              const api = createAxiosInstance()
              const deleteReq = await api.delete(`salesorder/${order.OrderID}`)
              console.log(deleteReq)
              if (deleteReq.status === 200) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Sales Order has been deleted successfully",
                  icon: "success",
                });
                loadSalesOrders();
              }
            } catch (error) {
              console.log(error);
              Swal.fire({
                title: "Error",
                text: "Failed to delete Sales Order",
                icon: "error",
              });
            }
          }

          deleteSalesOrderRequest(salesOrderRow);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track all sales orders in one place
              </p>
            </div>
            <button
              onClick={() => setOpenAddSalesOrderModal(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Sales Order
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm ">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search orders by ID or status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={loadSalesOrders}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>


          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            {/* Order Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{salesOrders.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {salesOrders.filter(order => order.Status?.toLowerCase() === "completed").length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {salesOrders.filter(order => order.Status?.toLowerCase() === "pending").length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(() => e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-auto sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search orders by ID or status"
                />
              </div>
              <div className="flex flex-grow space-x-2">
                <button
                  onClick={() => handlePrintSalesOrderTable(filteredOrders)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Table
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              className="rdt_Table"
              columns={columns}
              data={filteredOrders}
              customStyles={customStyles}
              highlightOnHover
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
              progressPending={isLoading}
              progressComponent={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              noDataComponent={
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-500">No orders found</p>
                  <p className="mt-1 text-sm text-gray-400">Try adjusting your search or create a new order</p>
                </div>
              }
            />
          </div>


        </div>
      </div>

      {openAddSalesOrderModal && (
        <SalesOrderAddModal
          setOpenAddSalesOrderModal={setOpenAddSalesOrderModal}
          loadSalesOrders={loadSalesOrders}
        />
      )}

      {opnEditSalesOrderModal && (
        <SalesOrderEditModal
          setOpenEditSalesOrderModal={setOpenEditSalesOrderModal}
          loadSalesOrders={loadSalesOrders}
          salseOrderInfo={opnEditSalesOrderModal}
        />
      )}

      {openSalesOrderDetailModal && (
        <SalesOrderInfoModal
          setOpenSalesOrderDetailModal={setOpenSalesOrderDetailModal}
          orderInfo={openSalesOrderDetailModal}
          pdfPrint={printOrder}
          thermalPrint={handlePrint}
        />
      )}
    </>
  );
}

export default SalesOrders;