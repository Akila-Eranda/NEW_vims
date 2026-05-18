import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";

const STATUS_COLORS = { Draft: "bg-gray-100 text-gray-600", Sent: "bg-blue-100 text-blue-700", Accepted: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700", Expired: "bg-orange-100 text-orange-700" };

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ CustomerID: "", QuotationDate: new Date().toISOString().split("T")[0], ValidUntil: "", Notes: "", items: [] });

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

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ProductID: "", Quantity: 1, UnitPrice: "", Discount: 0 }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, field, val) => {
    setForm(f => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: val };
      if (field === "ProductID") {
        const product = products.find(p => p.ProductID === parseInt(val));
        if (product) items[i].UnitPrice = product.SellingPrice;
      }
      items[i].Total = (parseFloat(items[i].Quantity || 0) * parseFloat(items[i].UnitPrice || 0)) - parseFloat(items[i].Discount || 0);
      return { ...f, items };
    });
  };

  const totalAmount = form.items.reduce((sum, i) => sum + (parseFloat(i.Quantity || 0) * parseFloat(i.UnitPrice || 0) - parseFloat(i.Discount || 0)), 0);

  const handleCreate = async () => {
    if (!form.CustomerID || form.items.length === 0) return Swal.fire("Warning", "Select a customer and add at least one item", "warning");
    try {
      await api.post("quotations", { ...form, TotalAmount: totalAmount });
      Swal.fire("Created!", "Quotation created successfully", "success");
      setShowModal(false);
      load();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const handleStatusChange = async (q, status) => {
    try {
      await api.patch(`quotations/${q.QuotationID}/status`, { Status: status });
      load();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const handleDelete = async (q) => {
    const result = await Swal.fire({ title: `Delete ${q.QuotationNumber}?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (result.isConfirmed) { await api.delete(`quotations/${q.QuotationID}`); load(); }
  };

  const filtered = quotations.filter(q =>
    q.QuotationNumber?.toLowerCase().includes(search.toLowerCase()) ||
    q.customer?.Name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { name: "Quotation #", selector: row => <span className="font-mono font-semibold text-blue-700">{row.QuotationNumber}</span>, sortable: true },
    { name: "Customer", selector: row => row.customer?.Name || "—", sortable: true, grow: 2 },
    { name: "Date", selector: row => new Date(row.QuotationDate).toLocaleDateString() },
    { name: "Valid Until", selector: row => row.ValidUntil ? new Date(row.ValidUntil).toLocaleDateString() : "—" },
    { name: "Amount", selector: row => <span className="font-semibold">Rs. {parseFloat(row.TotalAmount).toLocaleString()}</span> },
    { name: "Status", selector: row => <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[row.Status] || "bg-gray-100"}`}>{row.Status}</span> },
    {
      name: "Actions", cell: row => (
        <div className="flex gap-1">
          <select value={row.Status} onChange={e => handleStatusChange(row, e.target.value)} className="border border-gray-200 rounded text-xs px-1 py-1 focus:outline-none" onClick={e => e.stopPropagation()}>
            {["Draft", "Sent", "Accepted", "Rejected", "Expired"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => handleDelete(row)} className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ), width: "160px"
    }
  ];

  return (
    <div className="px-4 md:px-10 mx-auto w-full -m-24">
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white">
            <div className="rounded-t bg-white mb-0 px-6 py-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-blueGray-700 text-xl font-bold">Quotations</h6>
                  <p className="text-gray-500 text-sm mt-1">{quotations.length} total quotations</p>
                </div>
                <button onClick={() => { setForm({ CustomerID: "", QuotationDate: new Date().toISOString().split("T")[0], ValidUntil: "", Notes: "", items: [] }); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  New Quotation
                </button>
              </div>
              <input type="text" placeholder="Search by quotation # or customer..." value={search} onChange={e => setSearch(e.target.value)} className="mt-4 border border-gray-300 rounded-lg px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <DataTable columns={columns} data={filtered} pagination progressPending={isLoading} highlightOnHover responsive />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto p-6 my-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create Quotation</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                <select value={form.CustomerID} onChange={e => setForm({ ...form, CustomerID: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">Select customer...</option>
                  {customers.map(c => <option key={c.CustomerID} value={c.CustomerID}>{c.Name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Date *</label>
                <input type="date" value={form.QuotationDate} onChange={e => setForm({ ...form, QuotationDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input type="date" value={form.ValidUntil} onChange={e => setForm({ ...form, ValidUntil: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input type="text" value={form.Notes} onChange={e => setForm({ ...form, Notes: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Optional notes..." />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">Items</h4>
                <button onClick={addItem} className="text-blue-600 text-sm font-medium hover:text-blue-800">+ Add Item</button>
              </div>
              {form.items.length === 0 && <p className="text-gray-400 text-sm text-center py-4 border-2 border-dashed rounded-lg">No items added. Click "+ Add Item" to start.</p>}
              {form.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 mb-2 items-center">
                  <div className="col-span-4">
                    <select value={item.ProductID} onChange={e => updateItem(i, "ProductID", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300">
                      <option value="">Product...</option>
                      {products.map(p => <option key={p.ProductID} value={p.ProductID}>{p.Name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2"><input type="number" value={item.Quantity} onChange={e => updateItem(i, "Quantity", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none" placeholder="Qty" /></div>
                  <div className="col-span-2"><input type="number" step="0.01" value={item.UnitPrice} onChange={e => updateItem(i, "UnitPrice", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none" placeholder="Price" /></div>
                  <div className="col-span-2"><input type="number" step="0.01" value={item.Discount} onChange={e => updateItem(i, "Discount", e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none" placeholder="Disc." /></div>
                  <div className="col-span-1 text-sm text-right font-medium text-gray-700">Rs. {((parseFloat(item.Quantity || 0) * parseFloat(item.UnitPrice || 0)) - parseFloat(item.Discount || 0)).toLocaleString()}</div>
                  <div className="col-span-1 text-center"><button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700">✕</button></div>
                </div>
              ))}
              {form.items.length > 0 && (
                <div className="text-right mt-3 pt-3 border-t">
                  <span className="text-lg font-bold text-gray-800">Total: Rs. {totalAmount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium">Create Quotation</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quotations;
