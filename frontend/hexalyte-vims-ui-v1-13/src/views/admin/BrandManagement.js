import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";

function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [form, setForm] = useState({ Name: "", Description: "" });
  const [search, setSearch] = useState("");

  const api = createAxiosInstance();

  const load = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("brands");
      setBrands(res.data.brands || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditBrand(null); setForm({ Name: "", Description: "" }); setShowModal(true); };
  const openEdit = (b) => { setEditBrand(b); setForm({ Name: b.Name, Description: b.Description || "" }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.Name.trim()) return Swal.fire("Warning", "Brand name is required", "warning");
    try {
      if (editBrand) {
        await api.put(`brands/${editBrand.BrandID}`, form);
        Swal.fire("Updated!", "Brand updated successfully", "success");
      } else {
        await api.post("brands", form);
        Swal.fire("Created!", "Brand added successfully", "success");
      }
      setShowModal(false);
      load();
    } catch (e) { Swal.fire("Error", e.message, "error"); }
  };

  const handleDelete = async (b) => {
    const result = await Swal.fire({ title: `Delete "${b.Name}"?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (result.isConfirmed) {
      try { await api.delete(`brands/${b.BrandID}`); load(); Swal.fire("Deleted!", "", "success"); }
      catch (e) { Swal.fire("Error", e.message, "error"); }
    }
  };

  const filtered = brands.filter(b => b.Name?.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { name: "ID", selector: row => row.BrandID, width: "80px", sortable: true },
    { name: "Brand Name", selector: row => <span className="font-semibold text-gray-800">{row.Name}</span>, sortable: true, grow: 2 },
    { name: "Description", selector: row => row.Description || <span className="text-gray-300">—</span>, grow: 3 },
    { name: "Products", selector: row => <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{row.products?.length || 0}</span> },
    {
      name: "Actions", cell: row => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button onClick={() => handleDelete(row)} className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ), width: "120px"
    }
  ];

  return (
    <div className="px-4 md:px-10 mx-auto w-full -m-24">
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="text-blueGray-700 text-xl font-bold">Brand Management</h6>
                  <p className="text-gray-500 text-sm mt-1">Manage product brands</p>
                </div>
                <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Brand
                </button>
              </div>
              <div className="mt-4">
                <input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            <DataTable columns={columns} data={filtered} pagination progressPending={isLoading} highlightOnHover responsive />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{editBrand ? "Edit Brand" : "Add New Brand"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                <input type="text" value={form.Name} onChange={e => setForm({ ...form, Name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="e.g. Anchor, Nestlé" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.Description} onChange={e => setForm({ ...form, Description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Optional description..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">{editBrand ? "Update" : "Create"}</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandManagement;
