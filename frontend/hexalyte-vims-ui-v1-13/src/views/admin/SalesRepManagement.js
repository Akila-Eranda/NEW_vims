import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";

function SalesRepManagement() {
  const [salesReps, setSalesReps] = useState([]);
  const [targets, setTargets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState("reps");
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [form, setForm] = useState({ SalesRepID: "", Month: new Date().getMonth() + 1, Year: new Date().getFullYear(), TargetAmount: "", TargetOrders: "", CommissionRate: "" });

  const api = createAxiosInstance();

  const load = async () => {
    try {
      setIsLoading(true);
      const [reps, tgts] = await Promise.all([
        api.get("salesrep/summary"),
        api.get(`salesrep/targets?month=${month}&year=${year}`)
      ]);
      setSalesReps(reps.data.salesReps || []);
      setTargets(tgts.data.targets || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, [month, year]);

  const handleSetTarget = async () => {
    if (!form.SalesRepID) return Swal.fire("Warning", "Select a sales rep", "warning");
    try {
      await api.post("salesrep/targets", form);
      Swal.fire("Saved!", "Target set successfully", "success");
      setShowModal(false);
      load();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const updateAchievements = async (t) => {
    try {
      await api.put(`salesrep/targets/${t.SalesRepID}/${t.Month}/${t.Year}/achievements`);
      Swal.fire("Updated!", "Achievements recalculated", "success");
      load();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const repColumns = [
    { name: "Name", selector: row => <span className="font-semibold text-gray-800">{row.firstname} {row.lastname}</span>, sortable: true, grow: 2 },
    { name: "Email", selector: row => row.email || "—" },
    { name: "Assigned Customers", selector: row => <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{row.assignedCustomers?.length || 0} customers</span> },
    { name: "Routes", selector: row => <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">{row.routes?.length || 0} routes</span> },
    {
      name: "Set Target", cell: row => (
        <button onClick={() => { setForm({ SalesRepID: row.id, Month: month, Year: year, TargetAmount: "", TargetOrders: "", CommissionRate: "" }); setShowModal(true); }} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700">
          Set Target
        </button>
      ), width: "120px"
    }
  ];

  const targetColumns = [
    { name: "Sales Rep", selector: row => <span className="font-semibold">{row.salesRep?.firstname} {row.salesRep?.lastname}</span>, sortable: true, grow: 2 },
    { name: "Target Amount", selector: row => <span className="font-medium">Rs. {parseFloat(row.TargetAmount).toLocaleString()}</span> },
    { name: "Achieved", selector: row => <span className={`font-medium ${parseFloat(row.AchievedAmount) >= parseFloat(row.TargetAmount) ? "text-green-600" : "text-orange-600"}`}>Rs. {parseFloat(row.AchievedAmount).toLocaleString()}</span> },
    {
      name: "Progress", selector: row => {
        const pct = parseFloat(row.TargetAmount) > 0 ? Math.min((parseFloat(row.AchievedAmount) / parseFloat(row.TargetAmount)) * 100, 100) : 0;
        return (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1"><span>{pct.toFixed(0)}%</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${pct >= 100 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : "bg-orange-400"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      }, grow: 2
    },
    { name: "Orders", selector: row => `${row.AchievedOrders}/${row.TargetOrders}` },
    { name: "Commission", selector: row => <span className="text-green-600 font-semibold">Rs. {parseFloat(row.CommissionEarned).toLocaleString()}</span> },
    { name: "Rate", selector: row => `${row.CommissionRate}%` },
    {
      name: "Sync", cell: row => (
        <button onClick={() => updateAchievements(row)} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200" title="Recalculate from orders">↻ Sync</button>
      ), width: "80px"
    }
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="px-4 md:px-10 mx-auto w-full -m-24">
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white">
            <div className="rounded-t bg-white mb-0 px-6 py-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-blueGray-700 text-xl font-bold">Sales Rep Management</h6>
                  <p className="text-gray-500 text-sm mt-1">Track performance, targets & commissions</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 items-center flex-wrap">
                <button onClick={() => setTab("reps")} className={`px-5 py-2 rounded-lg text-sm font-medium ${tab === "reps" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>👥 Sales Reps</button>
                <button onClick={() => setTab("targets")} className={`px-5 py-2 rounded-lg text-sm font-medium ${tab === "targets" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>🎯 Targets & Commission</button>
                {tab === "targets" && (
                  <div className="flex gap-2 ml-auto">
                    <select value={month} onChange={e => setMonth(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                      {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                    </select>
                    <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                      {[2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <DataTable columns={tab === "reps" ? repColumns : targetColumns} data={tab === "reps" ? salesReps : targets} pagination progressPending={isLoading} highlightOnHover responsive />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Set Monthly Target</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select value={form.Month} onChange={e => setForm({ ...form, Month: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select value={form.Year} onChange={e => setForm({ ...form, Year: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {[2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (Rs.)</label>
                <input type="number" value={form.TargetAmount} onChange={e => setForm({ ...form, TargetAmount: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Orders</label>
                <input type="number" value={form.TargetOrders} onChange={e => setForm({ ...form, TargetOrders: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                <input type="number" step="0.1" value={form.CommissionRate} onChange={e => setForm({ ...form, CommissionRate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="e.g. 2.5" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSetTarget} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">Save Target</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesRepManagement;
