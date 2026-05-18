import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";

function FleetManagement() {
  const [tab, setTab] = useState("vehicles");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({ VehicleNumber: "", Type: "Van", Capacity: "", CapacityUnit: "Kg", Status: "Active", Notes: "" });
  const [driverForm, setDriverForm] = useState({ Name: "", Phone: "", LicenseNumber: "", LicenseExpiry: "", NIC: "", Address: "", Status: "Active" });

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
    else setDriverForm({ Name: item.Name, Phone: item.Phone || "", LicenseNumber: item.LicenseNumber || "", LicenseExpiry: item.LicenseExpiry || "", NIC: item.NIC || "", Address: item.Address || "", Status: item.Status });
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
      setShowModal(false);
      load();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({ title: "Delete this record?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (result.isConfirmed) {
      try {
        if (tab === "vehicles") await api.delete(`fleet/vehicles/${item.VehicleID}`);
        else await api.delete(`fleet/drivers/${item.DriverID}`);
        load();
      } catch (e) { Swal.fire("Error", e.message, "error"); }
    }
  };

  const StatusBadge = ({ s }) => {
    const colors = { Active: "bg-green-100 text-green-700", Maintenance: "bg-orange-100 text-orange-700", Inactive: "bg-red-100 text-red-700", OnLeave: "bg-yellow-100 text-yellow-700" };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[s] || "bg-gray-100"}`}>{s}</span>;
  };

  const vehicleColumns = [
    { name: "Vehicle #", selector: row => <span className="font-mono font-bold text-blue-700">{row.VehicleNumber}</span>, sortable: true },
    { name: "Type", selector: row => row.Type },
    { name: "Capacity", selector: row => row.Capacity ? `${row.Capacity} ${row.CapacityUnit}` : "—" },
    { name: "Driver", selector: row => row.driver?.Name || <span className="text-gray-300">Unassigned</span> },
    { name: "Status", selector: row => <StatusBadge s={row.Status} /> },
    { name: "Actions", cell: row => <div className="flex gap-2"><button onClick={() => openEdit(row)} className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button><button onClick={() => handleDelete(row)} className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></div>, width: "120px" }
  ];

  const driverColumns = [
    { name: "Name", selector: row => <span className="font-semibold">{row.Name}</span>, sortable: true, grow: 2 },
    { name: "Phone", selector: row => row.Phone || "—" },
    { name: "License #", selector: row => row.LicenseNumber || "—" },
    { name: "License Expiry", selector: row => row.LicenseExpiry ? new Date(row.LicenseExpiry).toLocaleDateString() : "—" },
    { name: "NIC", selector: row => row.NIC || "—" },
    { name: "Status", selector: row => <StatusBadge s={row.Status} /> },
    { name: "Actions", cell: row => <div className="flex gap-2"><button onClick={() => openEdit(row)} className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button><button onClick={() => handleDelete(row)} className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></div>, width: "120px" }
  ];

  return (
    <div className="px-4 md:px-10 mx-auto w-full -m-24">
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white">
            <div className="rounded-t bg-white mb-0 px-6 py-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-blueGray-700 text-xl font-bold">Fleet Management</h6>
                  <p className="text-gray-500 text-sm mt-1">Manage vehicles and drivers</p>
                </div>
                <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add {tab === "vehicles" ? "Vehicle" : "Driver"}
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setTab("vehicles")} className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${tab === "vehicles" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                  🚐 Vehicles ({vehicles.length})
                </button>
                <button onClick={() => setTab("drivers")} className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${tab === "drivers" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                  👤 Drivers ({drivers.length})
                </button>
              </div>
            </div>
            <DataTable columns={tab === "vehicles" ? vehicleColumns : driverColumns} data={tab === "vehicles" ? vehicles : drivers} pagination progressPending={isLoading} highlightOnHover responsive />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{editItem ? "Edit" : "Add"} {tab === "vehicles" ? "Vehicle" : "Driver"}</h3>
            {tab === "vehicles" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label><input type="text" value={vehicleForm.VehicleNumber} onChange={e => setVehicleForm({ ...vehicleForm, VehicleNumber: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="e.g. WP CAB 1234" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={vehicleForm.Type} onChange={e => setVehicleForm({ ...vehicleForm, Type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">{["Van", "Truck", "Motorbike", "Car", "ThreeWheeler"].map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={vehicleForm.Status} onChange={e => setVehicleForm({ ...vehicleForm, Status: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">{["Active", "Maintenance", "Inactive"].map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label><input type="number" value={vehicleForm.Capacity} onChange={e => setVehicleForm({ ...vehicleForm, Capacity: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Unit</label><select value={vehicleForm.CapacityUnit} onChange={e => setVehicleForm({ ...vehicleForm, CapacityUnit: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">{["Kg", "L", "Units"].map(u => <option key={u}>{u}</option>)}</select></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><input type="text" value={vehicleForm.Notes} onChange={e => setVehicleForm({ ...vehicleForm, Notes: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={driverForm.Name} onChange={e => setDriverForm({ ...driverForm, Name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" value={driverForm.Phone} onChange={e => setDriverForm({ ...driverForm, Phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">NIC</label><input type="text" value={driverForm.NIC} onChange={e => setDriverForm({ ...driverForm, NIC: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">License #</label><input type="text" value={driverForm.LicenseNumber} onChange={e => setDriverForm({ ...driverForm, LicenseNumber: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label><input type="date" value={driverForm.LicenseExpiry} onChange={e => setDriverForm({ ...driverForm, LicenseExpiry: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={driverForm.Status} onChange={e => setDriverForm({ ...driverForm, Status: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">{["Active", "Inactive", "OnLeave"].map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" value={driverForm.Address} onChange={e => setDriverForm({ ...driverForm, Address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" /></div>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">{editItem ? "Update" : "Add"}</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FleetManagement;
