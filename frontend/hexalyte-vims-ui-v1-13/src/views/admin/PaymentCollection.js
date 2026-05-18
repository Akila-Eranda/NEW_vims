import React, { useState, useEffect, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { createAxiosInstance } from 'api/axiosInstance';

const MODE_STYLE = {
  Cash:         { pill: 'bg-green-50 text-green-700 ring-green-200',   dot: 'bg-green-500',   icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  Cheque:       { pill: 'bg-blue-50 text-blue-700 ring-blue-200',      dot: 'bg-blue-500',    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  BankTransfer: { pill: 'bg-purple-50 text-purple-700 ring-purple-200', dot: 'bg-purple-500', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
  Credit:       { pill: 'bg-orange-50 text-orange-700 ring-orange-200', dot: 'bg-orange-500', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
};

const ModeBadge = ({ mode }) => {
  const s = MODE_STYLE[mode] || { pill: 'bg-gray-100 text-gray-600 ring-gray-200', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {mode || '—'}
    </span>
  );
};

const customStyles = {
  headRow: { style: { backgroundColor: '#f9fafb', border: 'none', minHeight: '48px' } },
  headCells: { style: { color: '#4b5563', fontSize: '13px', fontWeight: '600', paddingLeft: '20px', paddingRight: '16px' } },
  rows: {
    style: { fontSize: '13px', minHeight: '56px', borderBottom: '1px solid #f3f4f6' },
    highlightOnHoverStyle: { backgroundColor: '#f9fafb', transitionDuration: '0.15s', transitionProperty: 'background-color', borderBottomColor: '#f3f4f6', outlineColor: 'transparent' },
  },
  pagination: { style: { border: 'none', backgroundColor: '#fff', borderRadius: '0 0 8px 8px' } },
  cells: { style: { paddingLeft: '20px', paddingRight: '16px' } },
};

export default function PaymentCollection() {
  const [payments, setPayments]     = useState([]);
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [filterMode, setFilterMode] = useState('');
  const [search, setSearch]         = useState('');
  const [form, setForm] = useState({
    OrderID: '', CustomerID: '', Amount: '', PaymentMode: 'Cash',
    PaymentDate: new Date().toISOString().slice(0, 10), Reference: '', Notes: ''
  });

  const api = createAxiosInstance();

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterMode) params.PaymentMode = filterMode;
      const res = await api.get('payments', { params });
      setPayments(res.data.payments || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filterMode]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('salesorder');
      setOrders((res.data.orders || res.data || []).filter(o => o.PaymentStatus === 'UNPAID'));
    } catch (e) {}
  };

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const openModal = () => {
    fetchOrders();
    setForm({ OrderID: '', CustomerID: '', Amount: '', PaymentMode: 'Cash',
      PaymentDate: new Date().toISOString().slice(0, 10), Reference: '', Notes: '' });
    setShowModal(true);
  };

  const handleOrderChange = (orderId) => {
    const order = orders.find(o => String(o.OrderID) === String(orderId));
    const balance = order ? (parseFloat(order.TotalAmount || 0) - parseFloat(order.PaidAmount || 0)).toFixed(2) : '';
    setForm(f => ({ ...f, OrderID: orderId, CustomerID: order?.CustomerID || '', Amount: balance }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('payments', form);
      Swal.fire({ icon: 'success', title: 'Payment Recorded!', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      fetchPayments();
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || 'Failed to record payment', 'error');
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete this payment?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, delete it!'
    });
    if (!isConfirmed) return;
    await api.delete(`payments/${id}`);
    fetchPayments();
  };

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || (p.customer?.Name || '').toLowerCase().includes(q) || String(p.OrderID).includes(q);
    const matchMode   = !filterMode || p.PaymentMode === filterMode;
    return matchSearch && matchMode;
  });

  const totalToday = payments
    .filter(p => new Date(p.PaymentDate).toDateString() === new Date().toDateString())
    .reduce((s, p) => s + parseFloat(p.Amount || 0), 0);
  const totalAll = payments.reduce((s, p) => s + parseFloat(p.Amount || 0), 0);

  const columns = [
    {
      name: 'Customer',
      selector: row => row.customer?.Name || '—',
      cell: row => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">
            {(row.customer?.Name || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{row.customer?.Name || '—'}</p>
            {row.customer?.CompanyName && <p className="text-xs text-gray-400">{row.customer.CompanyName}</p>}
          </div>
        </div>
      ),
      sortable: true, grow: 2, minWidth: '180px'
    },
    {
      name: 'Order',
      selector: row => row.OrderID,
      cell: row => <span className="font-mono font-semibold text-blue-600 text-sm">#{row.OrderID}</span>,
      sortable: true, width: '100px'
    },
    {
      name: 'Amount',
      selector: row => parseFloat(row.Amount || 0),
      cell: row => <span className="font-bold text-green-700 text-sm">{Number(row.Amount || 0).toLocaleString()} LKR</span>,
      sortable: true
    },
    {
      name: 'Mode',
      cell: row => <ModeBadge mode={row.PaymentMode} />,
      width: '150px'
    },
    {
      name: 'Date',
      selector: row => row.PaymentDate,
      cell: row => <span className="text-gray-500 text-sm">{new Date(row.PaymentDate).toLocaleDateString('en-GB')}</span>,
      sortable: true
    },
    {
      name: 'Reference',
      cell: row => <span className="text-gray-500 text-sm">{row.Reference || '—'}</span>
    },
    {
      name: 'Collected By',
      cell: row => <span className="text-gray-600 text-sm">{row.collectedBy ? `${row.collectedBy.firstname} ${row.collectedBy.lastname}` : '—'}</span>
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          onClick={e => { e.stopPropagation(); handleDelete(row.PaymentID); }}
          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
          title="Delete"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      ),
      width: '80px'
    }
  ];

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Collection</h1>
              <p className="mt-1 text-sm text-gray-500">Record and track all customer payments in one place</p>
            </div>
            <button
              onClick={openModal}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Record Payment
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
                  placeholder="Search by customer name or order ID..."
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="min-w-[160px]">
                <select
                  value={filterMode}
                  onChange={e => setFilterMode(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Modes</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>BankTransfer</option>
                  <option>Credit</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => { setSearch(''); setFilterMode(''); }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
                <button
                  onClick={fetchPayments}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {(search || filterMode) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {search && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{search}"
                    <button onClick={() => setSearch('')} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                  </span>
                )}
                {filterMode && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Mode: {filterMode}
                    <button onClick={() => setFilterMode('')} className="ml-1 text-purple-600 hover:text-purple-800">×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Records",        value: payments.length,                   color: "text-blue-600",   bg: "bg-blue-100",   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                { label: "Total Collected",      value: `${totalAll.toLocaleString()} LKR`, color: "text-green-600",  bg: "bg-green-100",  icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
                { label: "Today's Collections",  value: `${totalToday.toLocaleString()} LKR`, color: "text-indigo-600", bg: "bg-indigo-100", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { label: "Cash Payments",        value: payments.filter(p => p.PaymentMode === 'Cash').length, color: "text-emerald-600", bg: "bg-emerald-100", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
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
              progressPending={loading}
              progressComponent={
                <div className="flex justify-center items-center h-52">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                </div>
              }
              noDataComponent={
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="w-14 h-14 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-base font-semibold text-gray-500">No payments found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or record a new payment</p>
                </div>
              }
            />
          </div>

        </div>
      </div>

      {/* ── Record Payment Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto p-4 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Record Payment
                </h3>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">

                  {/* Section: Order */}
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Details
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sales Order <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.OrderID}
                      onChange={e => handleOrderChange(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white"
                    >
                      <option value="">Select unpaid order…</option>
                      {orders.map(o => (
                        <option key={o.OrderID} value={o.OrderID}>
                          #{o.OrderID} — {o.customer?.Name || `Customer ${o.CustomerID}`} — Balance: {(parseFloat(o.TotalAmount||0)-parseFloat(o.PaidAmount||0)).toLocaleString()} LKR
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section: Payment Info */}
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2 pt-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Payment Info
                  </h4>

                  {/* Amount + Mode row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (LKR) <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.Amount}
                        onChange={e => setForm(f => ({ ...f, Amount: e.target.value }))}
                        placeholder="0.00"
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={form.PaymentMode}
                        onChange={e => setForm(f => ({ ...f, PaymentMode: e.target.value }))}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white"
                      >
                        <option>Cash</option>
                        <option>Cheque</option>
                        <option>BankTransfer</option>
                        <option>Credit</option>
                      </select>
                    </div>
                  </div>

                  {/* Date + Reference row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="date"
                        value={form.PaymentDate}
                        onChange={e => setForm(f => ({ ...f, PaymentDate: e.target.value }))}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reference / Cheque No.</label>
                      <input
                        type="text"
                        value={form.Reference}
                        onChange={e => setForm(f => ({ ...f, Reference: e.target.value }))}
                        placeholder="Optional"
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows={2}
                      value={form.Notes}
                      onChange={e => setForm(f => ({ ...f, Notes: e.target.value }))}
                      placeholder="Optional notes…"
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 resize-none"
                    />
                  </div>

                  {/* Amount preview */}
                  {form.Amount && (
                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-green-700">Payment Amount</span>
                      </div>
                      <span className="text-lg font-bold text-green-800">{Number(form.Amount).toLocaleString()} LKR</span>
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
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Payment
                  </button>
                </div>
              </form>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
