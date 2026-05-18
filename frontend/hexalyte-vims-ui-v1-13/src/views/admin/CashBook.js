import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";

const INCOME_CATS = ["Sales Collection", "Cash Sales", "Advance Payment", "Other Income"];
const EXPENSE_CATS = ["Purchase Payment", "Salary", "Transport", "Utilities", "Maintenance", "Stationery", "Other Expense"];

function CashBook() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [tab, setTab] = useState("all");
  const [dateFrom, setDateFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [form, setForm] = useState({ EntryDate: new Date().toISOString().split("T")[0], Type: "Income", Category: "", Description: "", Amount: "", PaymentMethod: "Cash", Reference: "" });

  const api = createAxiosInstance();

  const load = async () => {
    try {
      setIsLoading(true);
      const params = `?from=${dateFrom}&to=${dateTo}${tab !== "all" ? `&type=${tab}` : ""}`;
      const res = await api.get(`cashbook${params}`);
      setEntries(res.data.entries || []);
      setSummary(res.data.summary || { income: 0, expense: 0, balance: 0 });
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, [tab, dateFrom, dateTo]);

  const handleSave = async () => {
    if (!form.Description || !form.Amount) return Swal.fire("Warning", "Description and Amount are required", "warning");
    try {
      if (editEntry) await api.put(`cashbook/${editEntry.EntryID}`, form);
      else await api.post("cashbook", form);
      setShowModal(false);
      load();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const handleDelete = async (entry) => {
    const result = await Swal.fire({ title: "Delete this entry?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (result.isConfirmed) { await api.delete(`cashbook/${entry.EntryID}`); load(); }
  };

  const openAdd = (type = "Income") => {
    setEditEntry(null);
    setForm({ EntryDate: new Date().toISOString().split("T")[0], Type: type, Category: "", Description: "", Amount: "", PaymentMethod: "Cash", Reference: "" });
    setShowModal(true);
  };

  const columns = [
    { name: "Date", selector: row => new Date(row.EntryDate).toLocaleDateString(), sortable: true, width: "120px" },
    { name: "Type", selector: row => <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.Type === "Income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{row.Type}</span>, width: "100px" },
    { name: "Category", selector: row => <span className="text-gray-600 text-sm">{row.Category || "—"}</span> },
    { name: "Description", selector: row => row.Description, grow: 2 },
    { name: "Method", selector: row => <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{row.PaymentMethod}</span> },
    { name: "Reference", selector: row => row.Reference || "—" },
    { name: "Amount", selector: row => <span className={`font-bold ${row.Type === "Income" ? "text-green-600" : "text-red-600"}`}>{row.Type === "Income" ? "+" : "-"} Rs. {parseFloat(row.Amount).toLocaleString()}</span>, sortable: true },
    {
      name: "Actions", cell: row => (
        <div className="flex gap-1">
          <button onClick={() => { setEditEntry(row); setForm({ EntryDate: row.EntryDate, Type: row.Type, Category: row.Category || "", Description: row.Description, Amount: row.Amount, PaymentMethod: row.PaymentMethod, Reference: row.Reference || "" }); setShowModal(true); }} className="bg-indigo-500 text-white rounded-full p-1.5 hover:bg-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button onClick={() => handleDelete(row)} className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ), width: "90px"
    }
  ];

  return (
    <div className="px-4 md:px-10 mx-auto w-full -m-24">
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-500 rounded-xl p-5 text-white shadow-md">
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold mt-1">Rs. {parseFloat(summary.income).toLocaleString()}</p>
            </div>
            <div className="bg-red-500 rounded-xl p-5 text-white shadow-md">
              <p className="text-red-100 text-sm font-medium">Total Expense</p>
              <p className="text-2xl font-bold mt-1">Rs. {parseFloat(summary.expense).toLocaleString()}</p>
            </div>
            <div className={`${parseFloat(summary.balance) >= 0 ? "bg-blue-600" : "bg-orange-500"} rounded-xl p-5 text-white shadow-md`}>
              <p className="text-blue-100 text-sm font-medium">Net Balance</p>
              <p className="text-2xl font-bold mt-1">Rs. {parseFloat(summary.balance).toLocaleString()}</p>
            </div>
          </div>

          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white">
            <div className="rounded-t bg-white mb-0 px-6 py-6 border-b">
              <div className="flex justify-between items-center">
                <h6 className="text-blueGray-700 text-xl font-bold">Cash Book</h6>
                <div className="flex gap-2">
                  <button onClick={() => openAdd("Income")} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">+ Income</button>
                  <button onClick={() => openAdd("Expense")} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium">+ Expense</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 items-center">
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <span className="text-gray-500 text-sm">to</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <div className="flex gap-2">
                  {["all", "Income", "Expense"].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t === "all" ? "All" : t}</button>
                  ))}
                </div>
              </div>
            </div>
            <DataTable columns={columns} data={entries} pagination progressPending={isLoading} highlightOnHover responsive />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{editEntry ? "Edit" : "Add"} Cash Book Entry</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" value={form.EntryDate} onChange={e => setForm({ ...form, EntryDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select value={form.Type} onChange={e => setForm({ ...form, Type: e.target.value, Category: "" })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.Category} onChange={e => setForm({ ...form, Category: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">Select...</option>
                  {(form.Type === "Income" ? INCOME_CATS : EXPENSE_CATS).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select value={form.PaymentMethod} onChange={e => setForm({ ...form, PaymentMethod: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {["Cash", "Bank", "Cheque"].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input type="text" value={form.Description} onChange={e => setForm({ ...form, Description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Enter description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.) *</label>
                <input type="number" step="0.01" value={form.Amount} onChange={e => setForm({ ...form, Amount: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <input type="text" value={form.Reference} onChange={e => setForm({ ...form, Reference: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Invoice #, Cheque #..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className={`flex-1 text-white py-2 rounded-lg font-medium ${form.Type === "Income" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}`}>{editEntry ? "Update" : `Add ${form.Type}`}</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CashBook;
