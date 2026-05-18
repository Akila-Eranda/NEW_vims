import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { createAxiosInstance } from "api/axiosInstance";

const STATUS_STYLE = {
  Draft:    { pill: "bg-gray-100 text-gray-600 ring-gray-200",    dot: "bg-gray-400" },
  Sent:     { pill: "bg-blue-50 text-blue-700 ring-blue-200",     dot: "bg-blue-500" },
  Accepted: { pill: "bg-green-50 text-green-700 ring-green-200",  dot: "bg-green-500" },
  Rejected: { pill: "bg-red-50 text-red-700 ring-red-200",        dot: "bg-red-500" },
  Expired:  { pill: "bg-orange-50 text-orange-700 ring-orange-200", dot: "bg-orange-500" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status || "—"}
    </span>
  );
};

const customStyles = {
  headRow: { style: { backgroundColor: "#f9fafb", borderRadius: "0", border: "none", minHeight: "48px" } },
  headCells: { style: { color: "#4b5563", fontSize: "13px", fontWeight: "600", paddingLeft: "20px", paddingRight: "16px" } },
  rows: {
    style: { fontSize: "13px", minHeight: "56px", borderBottom: "1px solid #f3f4f6", "&:last-of-type": { borderBottom: "none" } },
    highlightOnHoverStyle: { backgroundColor: "#f9fafb", cursor: "pointer", transitionDuration: "0.15s", transitionProperty: "background-color", borderBottomColor: "#f3f4f6", outlineColor: "transparent" },
  },
  pagination: { style: { border: "none", backgroundColor: "#fff", borderRadius: "0 0 8px 8px" } },
  cells: { style: { paddingLeft: "20px", paddingRight: "16px" } },
};

function Quotations() {
  const [quotations, setQuotations]   = useState([]);
  const [customers, setCustomers]     = useState([]);
  const [products, setProducts]       = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState({
    CustomerID: "", QuotationDate: new Date().toISOString().split("T")[0],
    ValidUntil: "", Notes: "", items: []
  });

  const api = createAxiosInstance();

  const load = async () => {
    try {
      setIsLoading(true);
      const [q, c, p] = await Promise.all([api.get("quotations"), api.get("customer"), api.get("product")]);
      setQuotations(q.data.quotations || []);
      setCustomers(c.data.allCustomers || []);
      setProducts(p.data.allProducts || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAddModal = () => {
    setForm({ CustomerID: "", QuotationDate: new Date().toISOString().split("T")[0], ValidUntil: "", Notes: "", items: [] });
    setShowModal(true);
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ProductID: "", Quantity: 1, UnitPrice: "", Discount: 0 }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, field, val) => {
    setForm(f => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: val };
      if (field === "ProductID") {
        const prod = products.find(p => p.ProductID === parseInt(val));
        if (prod) items[i].UnitPrice = prod.SellingPrice;
      }
      items[i].Total = (parseFloat(items[i].Quantity || 0) * parseFloat(items[i].UnitPrice || 0)) - parseFloat(items[i].Discount || 0);
      return { ...f, items };
    });
  };

  const totalAmount = form.items.reduce((sum, i) => sum + (parseFloat(i.Quantity || 0) * parseFloat(i.UnitPrice || 0) - parseFloat(i.Discount || 0)), 0);

  const handleCreate = async () => {
    if (!form.CustomerID) return Swal.fire("Warning", "Please select a customer", "warning");
    if (form.items.length === 0) return Swal.fire("Warning", "Add at least one item", "warning");
    try {
      await api.post("quotations", { ...form, TotalAmount: totalAmount });
      Swal.fire({ title: "Created!", text: "Quotation created successfully", icon: "success", timer: 2000, showConfirmButton: false });
      setShowModal(false);
      load();
    } catch (e) { Swal.fire("Error", "Failed to create quotation", "error"); }
  };

  const handleStatusChange = async (q, status) => {
    try { await api.patch(`quotations/${q.QuotationID}/status`, { Status: status }); load(); }
    catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const handleDelete = async (q) => {
    const result = await Swal.fire({
      title: `Delete ${q.QuotationNumber}?`, icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", cancelButtonColor: "#6b7280", confirmButtonText: "Yes, delete it!"
    });
    if (result.isConfirmed) { await api.delete(`quotations/${q.QuotationID}`); load(); }
  };

  const filtered = quotations.filter(q => {
    const matchSearch = q.QuotationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      q.customer?.Name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || q.Status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      name: "Quotation #",
      selector: row => row.QuotationNumber,
      cell: row => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-semibold font-mono text-blue-700 text-sm">{row.QuotationNumber}</span>
        </div>
      ),
      sortable: true, minWidth: "180px"
    },
    {
      name: "Customer",
      selector: row => row.customer?.Name || "—",
      cell: row => <span className="text-gray-700 font-medium text-sm">{row.customer?.Name || "—"}</span>,
      sortable: true, grow: 2
    },
    {
      name: "Date",
      selector: row => row.QuotationDate,
      cell: row => <span className="text-gray-500 text-sm">{new Date(row.QuotationDate).toLocaleDateString("en-GB")}</span>,
      sortable: true
    },
    {
      name: "Valid Until",
      selector: row => row.ValidUntil,
      cell: row => row.ValidUntil
        ? <span className="text-gray-500 text-sm">{new Date(row.ValidUntil).toLocaleDateString("en-GB")}</span>
        : <span className="text-gray-300 text-sm">—</span>
    },
    {
      name: "Total Amount",
      selector: row => parseFloat(row.TotalAmount || 0),
      cell: row => <span className="font-semibold text-gray-800">{Number(row.TotalAmount || 0).toLocaleString()} LKR</span>,
      sortable: true
    },
    {
      name: "Status",
      cell: row => <StatusBadge status={row.Status} />,
      width: "130px"
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex items-center gap-1.5">
          <select
            value={row.Status}
            onChange={e => handleStatusChange(row, e.target.value)}
            onClick={e => e.stopPropagation()}
            className="border border-gray-200 rounded-lg text-xs px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-600"
          >
            {["Draft", "Sent", "Accepted", "Rejected", "Expired"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={e => { e.stopPropagation(); handleDelete(row); }}
            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
      width: "170px"
    }
  ];

  const counts = {
    total: quotations.length,
    draft: quotations.filter(q => q.Status === "Draft").length,
    accepted: quotations.filter(q => q.Status === "Accepted").length,
    sent: quotations.filter(q => q.Status === "Sent").length,
    rejected: quotations.filter(q => q.Status === "Rejected").length,
  };

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
              <p className="mt-1 text-sm text-gray-500">Manage and track all customer quotations</p>
            </div>
            <button
              onClick={openAddModal}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Quotation
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by quotation # or customer name..."
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="min-w-[160px]">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Statuses</option>
                  {["Draft", "Sent", "Accepted", "Rejected", "Expired"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => { setSearch(""); setStatusFilter(""); }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
                <button
                  onClick={load}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {(search || statusFilter) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {search && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{search}"
                    <button onClick={() => setSearch("")} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                  </span>
                )}
                {statusFilter && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter("")} className="ml-1 text-purple-600 hover:text-purple-800">×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Quotations", value: counts.total,    color: "text-blue-600",   bg: "bg-blue-100",   icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { label: "Draft",            value: counts.draft,    color: "text-gray-600",   bg: "bg-gray-100",   icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
                { label: "Sent",             value: counts.sent,     color: "text-indigo-600", bg: "bg-indigo-100", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { label: "Accepted",         value: counts.accepted, color: "text-green-600",  bg: "bg-green-100",  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-md ${c.bg}`}>
                      <svg className={`h-6 w-6 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">{c.label}</p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-900">{c.value}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={filtered}
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
              pagination
              progressPending={isLoading}
              progressComponent={
                <div className="flex justify-center items-center h-52">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                </div>
              }
              noDataComponent={
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="w-14 h-14 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-base font-semibold text-gray-500">No quotations found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or create a new quotation</p>
                </div>
              }
            />
          </div>

        </div>
      </div>

      {/* ── Add Quotation Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto p-4 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-3xl"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  New Quotation
                </h3>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[75vh]">

                {/* Section: Quotation Details */}
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quotation Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer <span className="text-red-500">*</span></label>
                    <select
                      value={form.CustomerID}
                      onChange={e => setForm({ ...form, CustomerID: e.target.value })}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                    >
                      <option value="">Select customer…</option>
                      {customers.map(c => <option key={c.CustomerID} value={c.CustomerID}>{c.Name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={form.QuotationDate}
                      onChange={e => setForm({ ...form, QuotationDate: e.target.value })}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                    <input
                      type="date"
                      value={form.ValidUntil}
                      onChange={e => setForm({ ...form, ValidUntil: e.target.value })}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input
                      type="text"
                      value={form.Notes}
                      onChange={e => setForm({ ...form, Notes: e.target.value })}
                      placeholder="Optional notes…"
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* Section: Items */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Items
                  </h4>
                  <button
                    onClick={addItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Item
                  </button>
                </div>

                {form.items.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl py-8 text-center text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-medium">No items yet</p>
                    <p className="text-xs mt-0.5">Click "Add Item" to add products</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    {/* Items header */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-2 text-center">Unit Price</div>
                      <div className="col-span-2 text-center">Discount</div>
                      <div className="col-span-1 text-right">Total</div>
                      <div className="col-span-1" />
                    </div>

                    {form.items.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                        <div className="col-span-4">
                          <select
                            value={item.ProductID}
                            onChange={e => updateItem(i, "ProductID", e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 bg-white"
                          >
                            <option value="">Select product…</option>
                            {products.map(p => <option key={p.ProductID} value={p.ProductID}>{p.Name}</option>)}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <input type="number" min="1" value={item.Quantity} onChange={e => updateItem(i, "Quantity", e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-300" placeholder="1" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" step="0.01" value={item.UnitPrice} onChange={e => updateItem(i, "UnitPrice", e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-300" placeholder="0.00" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" step="0.01" value={item.Discount} onChange={e => updateItem(i, "Discount", e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-300" placeholder="0.00" />
                        </div>
                        <div className="col-span-1 text-right text-xs font-semibold text-gray-700">
                          {((parseFloat(item.Quantity || 0) * parseFloat(item.UnitPrice || 0)) - parseFloat(item.Discount || 0)).toLocaleString()}
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Total row */}
                    <div className="px-3 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Grand Total</span>
                        <span className="text-lg font-bold text-gray-900">{totalAmount.toLocaleString()} LKR</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Quotation
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Quotations;
