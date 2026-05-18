import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { createAxiosInstance } from "api/axiosInstance";

function BatchTracking() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [daysFilter, setDaysFilter] = useState(30);
  const [tab, setTab] = useState("expiring");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    ProductID: "", BatchNumber: "", ManufactureDate: "",
    ExpiryDate: "", Quantity: "", BuyingPrice: "", Notes: ""
  });

  async function loadExpiring() {
    try {
      setIsLoading(true);
      const api = createAxiosInstance();
      const res = await api.get(`batches/expiring?days=${daysFilter}`);
      setBatches(res.data.batches || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  async function loadByProduct() {
    if (!selectedProduct) return;
    try {
      setIsLoading(true);
      const api = createAxiosInstance();
      const res = await api.get(`batches/product/${selectedProduct}`);
      setBatches(res.data.batches || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  async function loadProducts() {
    try {
      const api = createAxiosInstance();
      const res = await api.get("product");
      setProducts(res.data.allProducts || []);
    } catch (e) { console.error(e); }
  }

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { if (tab === "expiring") loadExpiring(); }, [tab, daysFilter]);
  useEffect(() => { if (tab === "product" && selectedProduct) loadByProduct(); }, [selectedProduct, tab]);

  const getDaysToExpiry = (date) => {
    if (!date) return null;
    return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  };

  const ExpiryBadge = ({ date }) => {
    const days = getDaysToExpiry(date);
    if (days === null) return <span className="text-gray-400 text-xs">No expiry</span>;
    if (days < 0) return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">EXPIRED</span>;
    if (days <= 7) return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">{days}d left</span>;
    if (days <= 30) return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{days}d left</span>;
    return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{days}d left</span>;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.ProductID) newErrors.ProductID = "Please select a product";
    if (!form.BatchNumber.trim()) newErrors.BatchNumber = "Batch number is required";
    if (!form.Quantity || Number(form.Quantity) <= 0) newErrors.Quantity = "Valid quantity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openModal = () => {
    setForm({ ProductID: "", BatchNumber: "", ManufactureDate: "", ExpiryDate: "", Quantity: "", BuyingPrice: "", Notes: "" });
    setErrors({});
    setShowModal(true);
  };

  async function handleAdd() {
    if (!validateForm()) return;
    try {
      const api = createAxiosInstance();
      await api.post("batches", form);
      Swal.fire({ title: "Added!", text: "Batch added successfully", icon: "success" });
      setShowModal(false);
      if (tab === "expiring") loadExpiring(); else loadByProduct();
    } catch (e) {
      Swal.fire({ title: "Error", text: "Failed to add batch", icon: "error" });
    }
  }

  function handleDelete(b) {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure you want to delete batch: ${b.BatchNumber}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const api = createAxiosInstance();
          await api.delete(`batches/${b.BatchID}`);
          Swal.fire({ title: "Deleted!", text: "Batch deleted successfully", icon: "success" });
          if (tab === "expiring") loadExpiring(); else loadByProduct();
        } catch (e) {
          Swal.fire({ title: "Error", text: "Failed to delete batch", icon: "error" });
        }
      }
    });
  }

  const customStyles = {
    headRow: {
      style: { backgroundColor: "#f9fafb", borderRadius: "8px 8px 0 0", border: "none", minHeight: "56px" },
    },
    headCells: {
      style: { color: "#4b5563", fontSize: "14px", fontWeight: "600", paddingLeft: "16px", paddingRight: "16px" },
    },
    rows: {
      style: { fontSize: "14px", minHeight: "60px", borderBottom: "1px solid #f3f4f6" },
      highlightOnHoverStyle: {
        backgroundColor: "#f3f4f6", cursor: "pointer", transitionDuration: "0.15s",
        transitionProperty: "background-color", borderBottomColor: "#f3f4f6", outlineColor: "transparent",
      },
    },
    pagination: {
      style: { border: "none", backgroundColor: "#fff", borderRadius: "0 0 8px 8px", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" },
    },
  };

  const columns = [
    {
      name: "Batch",
      cell: row => (
        <div className="flex items-center py-2">
          <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center text-orange-700 font-bold text-sm border border-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="ml-4">
            <div className="font-semibold text-gray-900 font-mono">{row.BatchNumber}</div>
            <div className="text-gray-500 text-sm">{row.product?.Name || "—"}</div>
          </div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.BatchNumber.localeCompare(b.BatchNumber),
      grow: 2,
    },
    {
      name: "Quantity",
      cell: row => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.Quantity} units
        </span>
      ),
      width: "120px",
    },
    {
      name: "Mfg Date",
      selector: row => row.ManufactureDate ? new Date(row.ManufactureDate).toLocaleDateString() : "—",
      sortable: true,
      style: { color: "#6b7280" },
    },
    {
      name: "Expiry Date",
      selector: row => row.ExpiryDate ? new Date(row.ExpiryDate).toLocaleDateString() : "—",
      sortable: true,
      style: { fontWeight: 500, color: "#1f2937" },
    },
    {
      name: "Status",
      cell: row => <ExpiryBadge date={row.ExpiryDate} />,
      width: "130px",
    },
    {
      name: "Buying Price",
      selector: row => row.BuyingPrice
        ? new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 }).format(row.BuyingPrice)
        : <span className="text-gray-300 text-xs">—</span>,
      sortable: true,
      style: { color: "#059669" },
    },
    {
      name: "Actions",
      cell: row => (
        <button
          className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
          onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
          title="Delete Batch"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      ),
      button: true,
      width: "80px",
    },
  ];

  const expiredCount = batches.filter(b => getDaysToExpiry(b.ExpiryDate) !== null && getDaysToExpiry(b.ExpiryDate) < 0).length;
  const criticalCount = batches.filter(b => { const d = getDaysToExpiry(b.ExpiryDate); return d !== null && d >= 0 && d <= 7; }).length;
  const safeCount = batches.filter(b => { const d = getDaysToExpiry(b.ExpiryDate); return d === null || d > 30; }).length;

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Batch & Expiry Tracking</h1>
              <p className="mt-1 text-sm text-gray-500">Track product batches, manufacture and expiry dates</p>
            </div>
            <button
              onClick={openModal}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Batch
            </button>
          </div>

          {/* Tabs & Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            {/* Tab Buttons Row */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setTab("expiring")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${tab === "expiring" ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Expiring Soon
              </button>
              <button
                onClick={() => setTab("product")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${tab === "product" ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                By Product
              </button>
            </div>

            {/* Filter Row */}
            {tab === "expiring" && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 mr-1">Expiring within:</span>
                {[7, 14, 30, 60, 90].map(d => (
                  <button
                    key={d}
                    onClick={() => setDaysFilter(d)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${daysFilter === d ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            )}

            {tab === "product" && (
              <select
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select Product...</option>
                {products.map(p => (
                  <option key={p.ProductID} value={p.ProductID}>
                    {p.Name}{p.SKU ? ` (${p.SKU})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Summary Cards */}
          <div className="px-0 py-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Batches</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{batches.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Expired</p>
                    <h3 className="mt-1 text-xl font-semibold text-red-600">{expiredCount}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-orange-100">
                    <svg className="h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Critical (≤7 days)</p>
                    <h3 className="mt-1 text-xl font-semibold text-orange-600">{criticalCount}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Safe (&gt;30 days)</p>
                    <h3 className="mt-1 text-xl font-semibold text-green-600">{safeCount}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={batches}
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
              progressPending={isLoading}
              progressComponent={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              noDataComponent={
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-500">No batches found</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {tab === "product" && !selectedProduct ? "Select a product to view its batches" : "Try adjusting your filter or add a new batch"}
                  </p>
                </div>
              }
            />
          </div>

        </div>
      </div>

      {/* Add Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Add New Batch
                </h3>
                <button
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                  onClick={() => setShowModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Batch Information
                </h4>

                <div className="space-y-4">
                  {/* Product */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="ProductID"
                      value={form.ProductID}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2.5 text-base border ${errors.ProductID ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-lg transition duration-200 bg-white`}
                    >
                      <option value="">Select Product...</option>
                      {products.map(p => (
                        <option key={p.ProductID} value={p.ProductID}>{p.Name}{p.SKU ? ` (${p.SKU})` : ""}</option>
                      ))}
                    </select>
                    {errors.ProductID && <p className="text-red-500 text-xs mt-1">{errors.ProductID}</p>}
                  </div>

                  {/* Batch Number + Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="BatchNumber"
                        value={form.BatchNumber}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.BatchNumber ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-lg transition duration-200 bg-white`}
                        placeholder="e.g. BATCH-2026-001"
                      />
                      {errors.BatchNumber && <p className="text-red-500 text-xs mt-1">{errors.BatchNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="Quantity"
                        value={form.Quantity}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.Quantity ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-lg transition duration-200 bg-white`}
                        placeholder="0"
                      />
                      {errors.Quantity && <p className="text-red-500 text-xs mt-1">{errors.Quantity}</p>}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Date</label>
                      <input
                        type="date"
                        name="ManufactureDate"
                        value={form.ManufactureDate}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-lg transition duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="date"
                        name="ExpiryDate"
                        value={form.ExpiryDate}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-lg transition duration-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Buying Price + Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price (LKR)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="BuyingPrice"
                        value={form.BuyingPrice}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-lg transition duration-200 bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <input
                        type="text"
                        name="Notes"
                        value={form.Notes}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 rounded-lg transition duration-200 bg-white"
                        placeholder="Optional notes..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200 flex items-center"
                  onClick={handleAdd}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Batch
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default BatchTracking;
