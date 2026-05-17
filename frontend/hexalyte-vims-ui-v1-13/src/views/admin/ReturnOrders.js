import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronDown, Package, Calendar, DollarSign, User, ArrowLeft, Eye, Check, X, Clock, AlertCircle, PlusCircle } from 'lucide-react';
import { createAxiosInstance } from 'api/axiosInstance';
import AddSalesReturnModal from 'components/Modal/AddSalesReturnModal';
import DataTable from "react-data-table-component";

const ReturnOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [returnOrders, setReturnOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function loadCustomersData() {
    try {
      setLoading(true);
      // const customerData = await axios.get(`${BASE_URL}customer`, { withCredentials: true });
      const api = createAxiosInstance()
      const customerData = await api.get('customer')
      setCustomers(() => [...customerData.data.allCustomers]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   sessionStorage.clear();
      //   history.push('/auth/login');
      // }
      if (error.status === 404 && error.response.data.message === "No Customers Found") {
        console.log("No Customers Found");
      } else {
        console.log(error)
      }
    }
  }

  async function fetchReturnOrders() {
    try {
      setLoading(true);
      setError(null);

      const api = createAxiosInstance();
      const returnOrdersRes = await api.get('return/salesorder');

      console.log('API Response:', returnOrdersRes);

      if (returnOrdersRes.status === 200) {
        let data = [];

        // Handle different possible response structures
        if (returnOrdersRes.data?.allReturnOrders) {
          data = returnOrdersRes.data.allReturnOrders;
        } else if (returnOrdersRes.data?.returnOrders) {
          data = returnOrdersRes.data.returnOrders;
        } else if (Array.isArray(returnOrdersRes.data)) {
          data = returnOrdersRes.data;
        } else if (returnOrdersRes.data?.data) {
          data = returnOrdersRes.data.data;
        } else {
          console.warn('Unexpected API response structure:', returnOrdersRes.data);
          data = [];
        }

        // Ensure data is an array and has valid structure
        if (Array.isArray(data)) {
          setReturnOrders(data);
          console.log(`Loaded ${data.length} return orders`);
        } else {
          console.error('Data is not an array:', data);
          setReturnOrders([]);
          setError('Invalid data format received from server');
        }
      } else {
        setError(`Server returned status: ${returnOrdersRes.status}`);
      }
    } catch (error) {
      console.error('Error fetching return orders:', error);

      // More specific error messages
      if (error.response) {
        // Server responded with error status
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        // Request was made but no response received
        setError('No response from server. Please check your connection.');
      } else {
        // Something else happened
        setError(`Error: ${error.message}`);
      }

      setReturnOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredReturns = useMemo(() => {
    if (!Array.isArray(returnOrders)) return [];

    return returnOrders.filter(returnOrder => {
      if (!returnOrder) return false;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (returnOrder.ReturnID?.toString() || '').toLowerCase().includes(searchLower) ||
        (returnOrder.SalesOrderID?.toString() || '').toLowerCase().includes(searchLower) ||
        (returnOrder.Reason || '').toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [returnOrders, searchTerm]);

  useEffect(() => {
    fetchReturnOrders();
  }, []);

  useEffect(() => {
    loadCustomersData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading return orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  // if (error) {
  //   return (
  //     <div className="bg-white min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
  //         <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Data</h3>
  //         <p className="mt-1 text-sm text-gray-500">{error}</p>
  //         <button
  //           onClick={fetchReturnOrders}
  //           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  const customStyles = {
    headRow: { style: { backgroundColor: "#f9fafb", borderRadius: "8px 8px 0 0", border: "none", minHeight: "56px" } },
    headCells: { style: { color: "#4b5563", fontSize: "14px", fontWeight: 600, paddingLeft: 16, paddingRight: 16 } },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "60px",
        borderBottom: "1px solid #f3f4f6",
        "&:last-of-type": { borderBottom: "none" },
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
        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
      },
    },
  };

  const returnColumns = [
    {
      id: "rid",
      name: "Return ID",
      selector: row => row.ReturnID,
      sortable: true,
      width: "120px",
      cell: row => <span className="font-medium text-gray-900">{row.ReturnID ?? "N/A"}</span>,
    },
    {
      id: "soid",
      name: "Sales / Purchase",
      sortable: true,
      sortFunction: (a, b) => String(a.SalesOrderID ?? "").localeCompare(String(b.SalesOrderID ?? "")),
      cell: row => (
        <div>
          <div className="text-sm font-mono text-gray-900">{row.SalesOrderID ?? "N/A"}</div>
          {row.PurchaseOrderID && <div className="text-xs text-gray-500">{row.PurchaseOrderID}</div>}
        </div>
      ),
      grow: 1.2,
    },
    {
      id: "dates",
      name: "Dates",
      sortable: true,
      sortFunction: (a, b) =>
        new Date(a.ReturnDate || a.createdAt || 0) - new Date(b.ReturnDate || b.createdAt || 0),
      cell: row => (
        <div className="text-sm">
          <div className="text-gray-900">{row.ReturnDate ? new Date(row.ReturnDate).toLocaleDateString() : "N/A"}</div>
          <div className="text-xs text-gray-500">
            Created: {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}
          </div>
        </div>
      ),
      width: "180px",
    },
    {
      id: "reason",
      name: "Reason",
      selector: row => row.Reason || "",
      sortable: true,
      grow: 2,
      cell: row => <div className="text-sm text-gray-900">{row.Reason || "No reason provided"}</div>,
    },
    {
      id: "items",
      name: "Items Count",
      selector: row => row.returnorderitems?.length ?? 0,
      sortable: true,
      width: "140px",
      cell: row => <div className="text-sm font-medium text-gray-900">{row.returnorderitems?.length || 0}</div>,
      right: false,
    },
    {
      id: "qty",
      name: "Total Return Quantity",
      selector: row => (row.returnorderitems?.reduce((s, it) => s + (it.Quantity || 0), 0) ?? 0),
      sortable: true,
      width: "200px",
      cell: row => (
        <div className="text-sm font-medium text-gray-900">
          {row.returnorderitems?.reduce((s, it) => s + (it.Quantity || 0), 0) || 0}
        </div>
      ),
    },
    {
      id: "actions",
      name: "Actions",
      button: true,
      width: "120px",
      cell: row => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedReturn(row); }}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
          title="View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          View
        </button>
      ),
    },
  ];



  if (selectedReturn) {
    return (
      <div className="bg-white min-h-screen">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedReturn(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Return Details</h1>
                <p className="text-sm text-gray-500">Return ID: {selectedReturn.ReturnID}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Order Information
              </h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Return ID:</span> {selectedReturn.ReturnID}</div>
                <div><span className="font-medium">Sales Order ID:</span> {selectedReturn.SalesOrderID}</div>
                {selectedReturn.PurchaseOrderID && (
                  <div><span className="font-medium">Purchase Order ID:</span> {selectedReturn.PurchaseOrderID}</div>
                )}
                <div>
                  <span className="font-medium">Created By User:</span>{" "}
                  {customers.find(c => c.CustomerID === selectedReturn.CreatedBy)?.Name
                    || selectedReturn.CreatedBy}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Return Information
              </h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Return Date:</span> {selectedReturn.ReturnDate ? new Date(selectedReturn.ReturnDate).toLocaleDateString() : 'N/A'}</div>
                <div><span className="font-medium">Reason:</span> {selectedReturn.Reason || 'N/A'}</div>
                <div><span className="font-medium">Created:</span> {selectedReturn.createdAt ? new Date(selectedReturn.createdAt).toLocaleDateString() : 'N/A'}</div>
                <div><span className="font-medium">Last Updated:</span> {selectedReturn.updatedAt ? new Date(selectedReturn.updatedAt).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Items Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Total Items</div>
                <div className="font-semibold text-lg">{selectedReturn.returnorderitems?.length || 0}</div>
              </div>
              <div>
                <div className="text-gray-600">Total Quantity</div>
                <div className="font-semibold text-lg">
                  {selectedReturn.returnorderitems?.reduce((sum, item) => sum + (item.Quantity || 0), 0) || 0}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Unique Products</div>
                <div className="font-semibold text-lg">
                  {selectedReturn.returnorderitems ?
                    new Set(selectedReturn.returnorderitems.map(item => item.ProductID)).size : 0}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Returned Items
            </h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Product ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Product Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Note</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Est. Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedReturn.returnorderitems?.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm font-mono">{item.ProductID || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{item.product?.Name || 'Unknown Product'}</td>
                        <td className="px-4 py-3 text-sm">{item.Quantity || 0}</td>
                        <td className="px-4 py-3 text-sm">
                          {item.Note ? (
                            <span className="text-gray-900">{item.Note}</span>
                          ) : (
                            <span className="text-gray-400 italic">No note</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {(Number(item.product?.SellingPrice || 0) * Number(item.Quantity || 0)).toFixed(2)} LKR
                        </td>
                      </tr>
                    );
                  }) || []}
                </tbody>
              </table>
            </div>

            {(!selectedReturn.returnorderitems || selectedReturn.returnorderitems.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Package className="mx-auto h-8 w-8 mb-2" />
                <p>No items found in this return order</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Order Returns</h1>
            <p className="text-sm text-gray-500">Manage and track product return requests</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {filteredReturns.length} of {returnOrders.length} returns
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by return ID, sales order ID, or reason..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 border text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Return
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm text-gray-600">Total Returns</div>
            <div className="text-2xl font-bold text-gray-900">{returnOrders.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm text-gray-600">Recent Returns</div>
            <div className="text-2xl font-bold text-blue-600">
              {returnOrders.filter(r => r.createdAt && new Date() - new Date(r.createdAt) < 7 * 24 * 60 * 60 * 1000).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm text-gray-600">Total Items</div>
            <div className="text-2xl font-bold text-green-600">
              {returnOrders.reduce((sum, r) =>
                sum + (r.returnorderitems?.reduce((itemSum, item) => itemSum + (item.Quantity || 0), 0) || 0), 0
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm text-gray-600">Avg Items/Return</div>
            <div className="text-2xl font-bold text-purple-600">
              {returnOrders.length > 0 ?
                Math.round(returnOrders.reduce((sum, r) => sum + (r.returnorderitems?.length || 0), 0) / returnOrders.length * 10) / 10
                : 0}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={returnColumns}
          data={filteredReturns}
          customStyles={customStyles}
          highlightOnHover
          pointerOnHover
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
          progressPending={loading}
          onRowClicked={(row) => setSelectedReturn(row)}
          progressComponent={
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
          noDataComponent={
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-500">No returns found</p>
              <p className="mt-1 text-sm text-gray-400">
                {searchTerm ? "Try adjusting your search" : "No return requests have been submitted yet"}
              </p>
            </div>
          }
          defaultSortFieldId="rid"
        />
      </div>

      {showAddModal && (
        <AddSalesReturnModal
          isOpen={showAddModal}
          fetchReturnOrders={fetchReturnOrders}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {filteredReturns.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No returns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'No return requests have been submitted yet'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnOrders;