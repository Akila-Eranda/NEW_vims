import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";

function BatchTracking() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [daysFilter, setDaysFilter] = useState(30);
  const [tab, setTab] = useState("expiring");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [form, setForm] = useState({ ProductID: "", BatchNumber: "", ManufactureDate: "", ExpiryDate: "", Quantity: "", BuyingPrice: "", Notes: "" });

  const api = createAxiosInstance();

  const loadExpiring = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`batches/expiring?days=${daysFilter}`);
      setBatches(res.data.batches || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const loadByProduct = async () => {
    if (!selectedProduct) return;
    try {
      setIsLoading(true);
      const res = await api.get(`batches/product/${selectedProduct}`);
      setBatches(res.data.batches || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("product");
      setProducts(res.data.allProducts || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { if (tab === "expiring") loadExpiring(); }, [tab, daysFilter]);
  useEffect(() => { if (tab === "product" && selectedProduct) loadByProduct(); }, [selectedProduct, tab]);

  const getDaysToExpiry = (date) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const ExpiryBadge = ({ date }) => {
    const days = getDaysToExpiry(date);
    if (days === null) return <span className="text-gray-300">No expiry</span>;
    if (days < 0) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">EXPIRED</span>;
    if (days <= 7) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">{days}d left</span>;
    if (days <= 30) return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{days}d left</span>;
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{days}d left</span>;
  };

  const handleAdd = async () => {
    if (!form.ProductID || !form.BatchNumber || !form.Quantity) return Swal.fire("Warning", "Product, Batch Number and Quantity are required", "warning");
    try {
      await api.post("batches", form);
      Swal.fire("Added!", "Batch added successfully", "success");
      setShowModal(false);
      if (tab === "expiring") loadExpiring(); else loadByProduct();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const handleDelete = async (b) => {
    const result = await Swal.fire({ title: `Delete batch ${b.BatchNumber}?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (result.isConfirmed) {
      try { await api.delete(`batches/${b.BatchID}`); if (tab === "expiring") loadExpiring(); else loadByProduct(); }
      catch (e) { Swal.fire("Error", e.message, "error"); }
    }
  };

  const columns = [
    { name: "Batch #", selector: row => <span className="font-mono text-sm font-semibold">{row.BatchNumber}</span>, sortable: true },
    { name: "Product", selector: row => row.product?.Name || "—", sortable: true, grow: 2 },
    { name: "Qty", selector: row => <span className="font-semibold">{row.Quantity}</span>, width: "80px" },
    { name: "Mfg Date", selector: row => row.ManufactureDate ? new Date(row.ManufactureDate).toLocaleDateString() : "—" },
    { name: "Expiry Date", selector: row => row.ExpiryDate ? new Date(row.ExpiryDate).toLocaleDateString() : "—" },
    { name: "Status", selector: row => <ExpiryBadge date={row.ExpiryDate} /> },
    { name: "Buying Price", selector: row => row.BuyingPrice ? `Rs. ${parseFloat(row.BuyingPrice).toLocaleString()}` : "—" },
    { name: "Actions", cell: row => <button onClick={() => handleDelete(row)} className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>, width: "80px" }
  ];

  return (
    <div className="px-4 md:px-10 mx-auto w-full -m-24">
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white">
            <div className="rounded-t bg-white mb-0 px-6 py-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-blueGray-700 text-xl font-bold">Batch & Expiry Tracking</h6>
                  <p className="text-gray-500 text-sm mt-1">Track product batches and expiry dates</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Batch
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={() => setTab("expiring")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "expiring" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>Expiring Soon</button>
                <button onClick={() => setTab("product")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "product" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>By Product</button>
              </div>

              {tab === "expiring" && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-gray-600">Show batches expiring within:</span>
                  {[7, 14, 30, 60, 90].map(d => (
                    <button key={d} onClick={() => setDaysFilter(d)} className={`px-3 py-1 rounded-full text-xs font-medium ${daysFilter === d ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>{d} days</button>
                  ))}
                </div>
              )}

              {tab === "product" && (
                <div className="mt-3">
                  <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <option value="">Select Product...</option>
                    {products.map(p => <option key={p.ProductID} value={p.ProductID}>{p.Name} {p.SKU ? `(${p.SKU})` : ""}</option>)}
                  </select>
                </div>
              )}
            </div>
            <DataTable columns={columns} data={batches} pagination progressPending={isLoading} highlightOnHover responsive />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Batch</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                <select value={form.ProductID} onChange={e => setForm({ ...form, ProductID: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">Select product...</option>
                  {products.map(p => <option key={p.ProductID} value={p.ProductID}>{p.Name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number *</label>
                <input type="text" value={form.BatchNumber} onChange={e => setForm({ ...form, BatchNumber: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="e.g. BATCH-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input type="number" value={form.Quantity} onChange={e => setForm({ ...form, Quantity: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Date</label>
                <input type="date" value={form.ManufactureDate} onChange={e => setForm({ ...form, ManufactureDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="date" value={form.ExpiryDate} onChange={e => setForm({ ...form, ExpiryDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price</label>
                <input type="number" step="0.01" value={form.BuyingPrice} onChange={e => setForm({ ...form, BuyingPrice: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="0.00" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input type="text" value={form.Notes} onChange={e => setForm({ ...form, Notes: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Optional notes..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">Add Batch</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchTracking;
