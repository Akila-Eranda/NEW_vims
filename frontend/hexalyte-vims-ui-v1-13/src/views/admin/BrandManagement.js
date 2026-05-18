import React, { useEffect, useState, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import TanStackTable from "components/Table/TanStackTable";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { createAxiosInstance } from "api/axiosInstance";

function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [form, setForm] = useState({ Name: "", Description: "" });
  const [errors, setErrors] = useState({});

  async function loadBrands() {
    try {
      setIsLoading(true);
      const api = createAxiosInstance();
      const res = await api.get("brands");
      setBrands(res.data.brands || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadBrands(); }, []);

  const openAdd = () => {
    setEditBrand(null);
    setForm({ Name: "", Description: "" });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditBrand(b);
    setForm({ Name: b.Name, Description: b.Description || "" });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.Name.trim()) newErrors.Name = "Brand name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSave() {
    if (!validateForm()) return;
    try {
      const api = createAxiosInstance();
      if (editBrand) {
        await api.put(`brands/${editBrand.BrandID}`, form);
        Swal.fire({ title: "Updated!", text: "Brand updated successfully", icon: "success" });
      } else {
        await api.post("brands", form);
        Swal.fire({ title: "Created!", text: "Brand added successfully", icon: "success" });
      }
      setShowModal(false);
      loadBrands();
    } catch (e) {
      Swal.fire({ title: "Error", text: "Operation failed", icon: "error" });
    }
  }

  async function handleDelete(b) {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure you want to delete the brand: ${b.Name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const api = createAxiosInstance();
          await api.delete(`brands/${b.BrandID}`);
          Swal.fire({ title: "Deleted!", text: "Brand has been deleted successfully", icon: "success" });
          loadBrands();
        } catch (e) {
          Swal.fire({ title: "Error", text: "Failed to delete brand", icon: "error" });
        }
      }
    });
  }

  const columnHelper = useMemo(() => createColumnHelper(), []);

  const columns = useMemo(() => [
    columnHelper.accessor("BrandID", {
      header: "ID",
      size: 70,
      cell: info => <span className="font-semibold text-gray-700">#{info.getValue()}</span>,
    }),
    columnHelper.accessor("Name", {
      header: "Brand",
      cell: info => {
        const row = info.row.original;
        return (
          <div className="flex items-center py-1">
            <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-purple-700 font-bold text-lg border border-purple-200">
              {row.Name ? row.Name.charAt(0).toUpperCase() : "B"}
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">{row.Name}</div>
              <div className="text-gray-500 text-sm truncate max-w-xs">{row.Description || "No description"}</div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor(row => row.products?.length || 0, {
      id: "products",
      header: "Products",
      size: 120,
      cell: info => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {info.getValue()} products
        </span>
      ),
    }),
    columnHelper.accessor("isActive", {
      header: "Status",
      size: 110,
      cell: info => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${info.getValue() !== false ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          {info.getValue() !== false ? "Active" : "Inactive"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      size: 110,
      enableSorting: false,
      cell: info => {
        const row = info.row.original;
        return (
          <div className="flex space-x-2">
            <button
              className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200"
              onClick={e => { e.stopPropagation(); openEdit(row); }}
              title="Edit Brand"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200"
              onClick={e => { e.stopPropagation(); handleDelete(row); }}
              title="Delete Brand"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        );
      },
    }),
  ], [brands]);

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your product brands and manufacturers</p>
            </div>
            <button
              onClick={openAdd}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Brand
            </button>
          </div>

          {/* Summary Cards */}
          <div className="px-0 py-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Brands</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{brands.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Active Brands</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {brands.filter(b => b.isActive !== false).length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">With Products</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{brands.filter(b => b.products?.length > 0).length}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <TanStackTable
            columns={columns}
            data={brands}
            isLoading={isLoading}
            searchPlaceholder="Search brands by name or description..."
            noDataMessage="No brands found"
            noDataSubMessage="Try adjusting your search or add a new brand"
            onRefresh={loadBrands}
          />

        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-11/12 lg:w-1/2 my-6 mx-auto max-w-2xl"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {editBrand ? "Edit Brand" : "Add New Brand"}
                </h3>
                <button
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                  onClick={() => setShowModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Brand Information
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={form.Name}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2.5 text-base border ${errors.Name ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
                      placeholder="e.g. Anchor, Nestlé, Milo"
                    />
                    {errors.Name && (
                      <p className="text-red-500 text-xs mt-1">{errors.Name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="Description"
                      value={form.Description}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                      placeholder="Enter a short description about this brand (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                  onClick={handleSave}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {editBrand ? "Update Brand" : "Add Brand"}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default BrandManagement;
