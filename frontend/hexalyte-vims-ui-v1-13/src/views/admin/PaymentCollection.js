import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { createAxiosInstance } from 'api/axiosInstance';

const BASE_URL = 'https://api.test.hexalyte.com/v1/';

export default function PaymentCollection() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterMode, setFilterMode] = useState('');
  const [search, setSearch] = useState('');
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
      const res = await api.get(`${BASE_URL}payments`, { params });
      setPayments(res.data.payments || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filterMode]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`${BASE_URL}salesorder`);
      setOrders((res.data.orders || res.data || []).filter(o => o.PaymentStatus === 'UNPAID'));
    } catch (e) {}
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`${BASE_URL}customer`);
      setCustomers(res.data.customers || res.data || []);
    } catch (e) {}
  };

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const openModal = () => {
    fetchOrders(); fetchCustomers();
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
      await api.post(`${BASE_URL}payments`, form);
      Swal.fire({ icon: 'success', title: 'Payment Recorded!', timer: 1500, showConfirmButton: false });
      setShowModal(false); fetchPayments();
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || 'Failed to record payment', 'error');
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: 'Delete payment?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e53e3e' });
    if (!isConfirmed) return;
    await api.delete(`${BASE_URL}payments/${id}`);
    fetchPayments();
  };

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    return !q || (p.customer?.Name || '').toLowerCase().includes(q) || String(p.OrderID).includes(q);
  });

  const totalToday = payments
    .filter(p => new Date(p.PaymentDate).toDateString() === new Date().toDateString())
    .reduce((s, p) => s + parseFloat(p.Amount || 0), 0);

  const modeColor = { Cash: 'bg-green-100 text-green-800', Cheque: 'bg-blue-100 text-blue-800', BankTransfer: 'bg-purple-100 text-purple-800', Credit: 'bg-orange-100 text-orange-800' };

  return (
    <div className="px-4 md:px-10 py-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Collection</h2>
          <p className="text-gray-500 text-sm mt-1">Record and track customer payments</p>
        </div>
        <button onClick={openModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow">
          + Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase font-semibold">Today's Collections</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">Rs. {totalToday.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase font-semibold">Total Records</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{payments.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 uppercase font-semibold">Total Collected</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">Rs. {payments.reduce((s, p) => s + parseFloat(p.Amount || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Search customer or order..." value={search} onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <select value={filterMode} onChange={e => setFilterMode(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Modes</option>
          <option>Cash</option><option>Cheque</option><option>BankTransfer</option><option>Credit</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {['#', 'Customer', 'Order', 'Amount', 'Mode', 'Date', 'Reference', 'Collected By', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400">No payments found</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.PaymentID} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{p.customer?.Name || '—'}<br /><span className="text-xs text-gray-400">{p.customer?.CompanyName}</span></td>
                <td className="px-4 py-3 text-blue-600 font-medium">#{p.OrderID}</td>
                <td className="px-4 py-3 font-bold text-green-700">Rs. {parseFloat(p.Amount || 0).toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${modeColor[p.PaymentMode] || 'bg-gray-100'}`}>{p.PaymentMode}</span></td>
                <td className="px-4 py-3">{new Date(p.PaymentDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-500">{p.Reference || '—'}</td>
                <td className="px-4 py-3">{p.collectedBy ? `${p.collectedBy.firstname} ${p.collectedBy.lastname}` : '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(p.PaymentID)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Record Payment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order *</label>
                <select required value={form.OrderID} onChange={e => handleOrderChange(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">Select Order</option>
                  {orders.map(o => (
                    <option key={o.OrderID} value={o.OrderID}>
                      #{o.OrderID} - {o.customer?.Name || `Customer ${o.CustomerID}`} - Balance: Rs. {(parseFloat(o.TotalAmount||0)-parseFloat(o.PaidAmount||0)).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input required type="number" step="0.01" min="0" value={form.Amount} onChange={e => setForm(f => ({...f, Amount: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode *</label>
                <select required value={form.PaymentMode} onChange={e => setForm(f => ({...f, PaymentMode: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option>Cash</option><option>Cheque</option><option>BankTransfer</option><option>Credit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
                <input required type="date" value={form.PaymentDate} onChange={e => setForm(f => ({...f, PaymentDate: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference / Cheque No.</label>
                <input type="text" value={form.Reference} onChange={e => setForm(f => ({...f, Reference: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.Notes} onChange={e => setForm(f => ({...f, Notes: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" rows={2} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">Save Payment</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
