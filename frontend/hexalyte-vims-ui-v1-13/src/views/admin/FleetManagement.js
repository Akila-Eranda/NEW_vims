import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { createAxiosInstance } from "api/axiosInstance";

const STATUS_STYLE = {
  Active:      { pill: "bg-green-50 text-green-700 ring-green-200",   dot: "bg-green-500" },
  Maintenance: { pill: "bg-orange-50 text-orange-700 ring-orange-200", dot: "bg-orange-500" },
  Inactive:    { pill: "bg-red-50 text-red-700 ring-red-200",         dot: "bg-red-500" },
  OnLeave:     { pill: "bg-yellow-50 text-yellow-700 ring-yellow-200", dot: "bg-yellow-500" },
};

const StatusBadge = ({ s }) => {
  const st = STATUS_STYLE[s] || { pill: "bg-gray-100 text-gray-600 ring-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${st.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
      {s}
    </span>
  );
};

const customStyles = {
  headRow: { style: { backgroundColor: "#f9fafb", border: "none", minHeight: "48px" } },
  headCells: { style: { color: "#4b5563", fontSize: "13px", fontWeight: "600", paddingLeft: "20px", paddingRight: "16px" } },
  rows: {
    style: { fontSize: "13px", minHeight: "56px", borderBottom: "1px solid #f3f4f6" },
    highlightOnHoverStyle: { backgroundColor: "#f9fafb", transitionDuration: "0.15s", transitionProperty: "background-color", borderBottomColor: "#f3f4f6", outlineColor: "transparent" },
  },
  pagination: { style: { border: "none", backgroundColor: "#fff", borderRadius: "0 0 8px 8px" } },
  cells: { style: { paddingLeft: "20px", paddingRight: "16px" } },
};

const ipt = "block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400";
const sel = "block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white";

function FleetManagement() {
  const [tab, setTab]         = useState("vehicles");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [vehicleForm, setVehicleForm] = useState({ VehicleNumber: "", Type: "Van", Capacity: "", CapacityUnit: "Kg", Status: "Active", Notes: "" });
  const [driverForm, setDriverForm]   = useState({ Name: "", Phone: "", LicenseNumber: "", LicenseExpiry: "", NIC: "", Address: "", Status: "Active" });

  const api = createAxiosInstance();

  const load = async () => {
    try {
      setIsLoading(true);
      const [v, d] = await Promise.all([api.get("fleet/vehicles"), api.get("fleet/drivers")]);
      setVehicles(v.data.vehicles || []);
      setDrivers(d.data.drivers || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditItem(null);
    if (tab === "vehicles") setVehicleForm({ VehicleNumber: "", Type: "Van", Capacity: "", CapacityUnit: "Kg", Status: "Active", Notes: "" });
    else setDriverForm({ Name: "", Phone: "", LicenseNumber: "", LicenseExpiry: "", NIC: "", Address: "", Status: "Active" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    if (tab === "vehicles") setVehicleForm({ VehicleNumber: item.VehicleNumber, Type: item.Type, Capacity: item.Capacity || "", CapacityUnit: item.CapacityUnit || "Kg", Status: item.Status, Notes: item.Notes || "" });
    else setDriverForm({ Name: item.Name, Phone: item.Phone || "", LicenseNumber: item.LicenseNumber || "", LicenseExpiry: item.LicenseExpiry ? item.LicenseExpiry.slice(0,10) : "", NIC: item.NIC || "", Address: item.Address || "", Status: item.Status });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (tab === "vehicles") {
        if (!vehicleForm.VehicleNumber) return Swal.fire("Warning", "Vehicle number is required", "warning");
        if (editItem) await api.put(`fleet/vehicles/${editItem.VehicleID}`, vehicleForm);
        else await api.post("fleet/vehicles", vehicleForm);
      } else {
        if (!driverForm.Name) return Swal.fire("Warning", "Driver name is required", "warning");
        if (editItem) await api.put(`fleet/drivers/${editItem.DriverID}`, driverForm);
        else await api.post("fleet/drivers", driverForm);
      }
      Swal.fire({ icon: "success", title: editItem ? "Updated!" : "Created!", timer: 1500, showConfirmButton: false });
      setShowModal(false);
      load();
    } catch (e) { Swal.fire("Error", e?.response?.data?.message || e.message, "error"); }
  };

  const handleDelete = async (item) => {
    const { isConfirmed } = await Swal.fire({ title: "Delete this record?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#6b7280", confirmButtonText: "Yes, delete it!" });
    if (!isConfirmed) return;
    try {
      if (tab === "vehicles") await api.delete(`fleet/vehicles/${item.VehicleID}`);
      else await api.delete(`fleet/drivers/${item.DriverID}`);
      load();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const ActionBtns = ({ row }) => (
    <div className="flex gap-1.5">
      <button onClick={e => { e.stopPropagation(); openEdit(row); }} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button onClick={e => { e.stopPropagation(); handleDelete(row); }} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0}}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  const vehicleColumns = [
    {
      name: "Vehicle #",
      selector: row => row.VehicleNumber,
      cell: row => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
            {row.Type?.[0] || "V"}
          </div>
          <span className="font-mono font-bold text-blue-700 text-sm">{row.VehicleNumber}</span>
        </div>
      ),
      sortable: true, minWidth: "150px"
    },
    { name: "Type", selector: row => row.Type, cell: row => <span className="text-sm text-gray-700">{row.Type}</span>, sortable: true },
    { name: "Capacity", cell: row => <span className="text-sm text-gray-600">{row.Capacity ? `${row.Capacity} ${row.CapacityUnit}` : "—"}</span> },
    { name: "Driver", cell: row => <span className={`text-sm ${row.driver?.Name ? "text-gray-700 font-medium" : "text-gray-400 italic"}`}>{row.driver?.Name || "Unassigned"}</span> },
    { name: "Status", cell: row => <StatusBadge s={row.Status} />, sortable: true },
    { name: "Actions", cell: row => <ActionBtns row={row} />, width: "90px" },
  ];

  const driverColumns = [
    {
      name: "Driver",
      selector: row => row.Name,
      cell: row => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
            {row.Name?.[0]?.toUpperCase() || "D"}
          </div>
          <span className="font-semibold text-gray-800 text-sm">{row.Name}</span>
        </div>
      ),
      sortable: true, grow: 2, minWidth: "160px"
    },
    { name: "Phone",    cell: row => <span className="text-sm text-gray-600">{row.Phone || "—"}</span> },
    { name: "License #", cell: row => <span className="font-mono text-sm text-gray-700">{row.LicenseNumber || "—"}</span> },
    { name: "Expiry",   cell: row => <span className="text-sm text-gray-600">{row.LicenseExpiry ? new Date(row.LicenseExpiry).toLocaleDateString("en-GB") : "—"}</span> },
    { name: "NIC",      cell: row => <span className="text-sm text-gray-600">{row.NIC || "—"}</span> },
    { name: "Status",   cell: row => <StatusBadge s={row.Status} />, sortable: true },
    { name: "Actions",  cell: row => <ActionBtns row={row} />, width: "90px" },
  ];

  const data    = tab === "vehicles" ? vehicles : drivers;
  const filtered = data.filter(r => {
    const q = search.toLowerCase();
    const name = tab === "vehicles" ? r.VehicleNumber : r.Name;
    const matchSearch = !q || (name || "").toLowerCase().includes(q);
    const matchStatus = !filterStatus || r.Status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeV  = vehicles.filter(v => v.Status === "Active").length;
  const maintV   = vehicles.filter(v => v.Status === "Maintenance").length;
  const activeD  = drivers.filter(d => d.Status === "Active").length;

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your vehicles and drivers in one place</p>
            </div>
            <button
              onClick={openAdd}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add {tab === "vehicles" ? "Vehicle" : "Driver"}
            </button>
          </div>

          {/* Segmented Tab */}
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex mb-6">
            {[
              { key: "vehicles", label: "Vehicles", count: vehicles.length, icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 5H4m0 0l4 4m-4-4l4-4" },
              { key: "drivers",  label: "Drivers",  count: drivers.length,  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSearch(""); setFilterStatus(""); }}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${tab === t.key ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                </svg>
                {t.label}
                <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${tab === t.key ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
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
                  placeholder={tab === "vehicles" ? "Search by vehicle number…" : "Search by driver name…"}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="min-w-[160px]">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Statuses</option>
                  {tab === "vehicles"
                    ? ["Active", "Maintenance", "Inactive"].map(s => <option key={s}>{s}</option>)
                    : ["Active", "Inactive", "OnLeave"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setSearch(""); setFilterStatus(""); }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
                <button onClick={load}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
            {(search || filterStatus) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {search && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Search: "{search}" <button onClick={() => setSearch("")} className="ml-1 text-blue-600">×</button></span>}
                {filterStatus && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Status: {filterStatus} <button onClick={() => setFilterStatus("")} className="ml-1 text-purple-600">×</button></span>}
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Vehicles",    value: vehicles.length, color: "text-blue-600",   bg: "bg-blue-100",   icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 5H4m0 0l4 4m-4-4l4-4" },
                { label: "Active Vehicles",   value: activeV,         color: "text-green-600",  bg: "bg-green-100",  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "In Maintenance",    value: maintV,          color: "text-orange-600", bg: "bg-orange-100", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
                { label: "Active Drivers",    value: activeD,         color: "text-indigo-600", bg: "bg-indigo-100", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
                  <div className={`p-2.5 rounded-md ${c.bg}`}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0}} className={c.color}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">{c.label}</p>
                    <p className="text-xl font-bold text-gray-900">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={tab === "vehicles" ? vehicleColumns : driverColumns}
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
                  <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300 mb-3" style={{flexShrink:0}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 5H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <p className="text-base font-semibold text-gray-500">No records found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new {tab === "vehicles" ? "vehicle" : "driver"}</p>
                </div>
              }
            />
          </div>

        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto p-4 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">

              {/* Modal Header */}
              <div className={`px-6 py-4 flex items-center justify-between bg-gradient-to-r ${tab === "vehicles" ? "from-blue-600 to-indigo-600" : "from-indigo-600 to-purple-600"}`}>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0,color:"#111827"}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab === "vehicles" ? "M8 7h12m0 0l-4-4m4 4l-4 4m0 5H4m0 0l4 4m-4-4l4-4" : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"} />
                  </svg>
                  {editItem ? "Edit" : "Add"} {tab === "vehicles" ? "Vehicle" : "Driver"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {tab === "vehicles" ? (
                  <>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500" style={{flexShrink:0}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 5H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Vehicle Details
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number <span className="text-red-500">*</span></label>
                      <input type="text" value={vehicleForm.VehicleNumber} onChange={e => setVehicleForm({...vehicleForm, VehicleNumber: e.target.value})} placeholder="e.g. WP CAB 1234" className={ipt} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select value={vehicleForm.Type} onChange={e => setVehicleForm({...vehicleForm, Type: e.target.value})} className={sel}>
                          {["Van","Truck","Motorbike","Car","ThreeWheeler"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={vehicleForm.Status} onChange={e => setVehicleForm({...vehicleForm, Status: e.target.value})} className={sel}>
                          {["Active","Maintenance","Inactive"].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input type="number" value={vehicleForm.Capacity} onChange={e => setVehicleForm({...vehicleForm, Capacity: e.target.value})} placeholder="0" className={ipt} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select value={vehicleForm.CapacityUnit} onChange={e => setVehicleForm({...vehicleForm, CapacityUnit: e.target.value})} className={sel}>
                          {["Kg","L","Units"].map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <input type="text" value={vehicleForm.Notes} onChange={e => setVehicleForm({...vehicleForm, Notes: e.target.value})} placeholder="Optional" className={ipt} />
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-500" style={{flexShrink:0}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Driver Details
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" value={driverForm.Name} onChange={e => setDriverForm({...driverForm, Name: e.target.value})} className={ipt} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" value={driverForm.Phone} onChange={e => setDriverForm({...driverForm, Phone: e.target.value})} className={ipt} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                        <input type="text" value={driverForm.NIC} onChange={e => setDriverForm({...driverForm, NIC: e.target.value})} className={ipt} />
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2 pt-1">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-500" style={{flexShrink:0}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      License Info
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">License #</label>
                        <input type="text" value={driverForm.LicenseNumber} onChange={e => setDriverForm({...driverForm, LicenseNumber: e.target.value})} className={ipt} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input type="date" value={driverForm.LicenseExpiry} onChange={e => setDriverForm({...driverForm, LicenseExpiry: e.target.value})} className={ipt} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={driverForm.Status} onChange={e => setDriverForm({...driverForm, Status: e.target.value})} className={sel}>
                          {["Active","Inactive","OnLeave"].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" value={driverForm.Address} onChange={e => setDriverForm({...driverForm, Address: e.target.value})} className={ipt} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none">
                  Cancel
                </button>
                <button type="button" onClick={handleSave}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:outline-none flex items-center gap-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {editItem ? "Update" : "Save"}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default FleetManagement;
