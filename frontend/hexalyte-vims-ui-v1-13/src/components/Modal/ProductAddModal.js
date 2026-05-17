import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Import for animation effects
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ProductAddModal({ setOpenModal, addProduct }) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Name: "",
    Description: "",
    BuyingPrice: "",
    SellingPrice: "",
    QuantityInStock: 0,
    SupplierID: 0,
    CategoryID: 0
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setNewProduct((p) => ({ ...p, [e.target.name]: e.target.value }));
    // Clear error when field is modified
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newProduct.Name.trim()) {
      newErrors.Name = "Product name is required";
    }

    if (!newProduct.Description.trim()) {
      newErrors.Description = "Description is required";
    }

    if (!newProduct.BuyingPrice || parseFloat(newProduct.BuyingPrice) <= 0) {
      newErrors.BuyingPrice = "Valid buying price is required";
    }

    if (!newProduct.SellingPrice || parseFloat(newProduct.SellingPrice) <= 0) {
      newErrors.SellingPrice = "Valid selling price is required";
    }

    if (newProduct.SupplierID === 0) {
      newErrors.SupplierID = "Please select a supplier";
    }

    if (newProduct.CategoryID === 0) {
      newErrors.CategoryID = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addProduct(newProduct);
    }
  };

  async function fetchCategories() {
    try {
      const api = createAxiosInstance();
      const categoryRes = await api.get(`category`);
      // const categoryRes = await axios.get(`${BASE_URL}category`, { withCredentials: true });
      if (categoryRes.status === 200) {
        setCategories(() => categoryRes.data.allCategory.filter(category => category.isActive !== false));
      }
    } catch (error) {

      if (error.status === 404 && error.response.data.message === "No Categories Found") {
        console.log("No Categories Found");
      } else {
        console.log(error)
      }

    }
  }

  async function fetchSuppliers() {
    try {
      const api = createAxiosInstance();
      const supplierRs = await api.get(`supplier`)
      // const supplierRs = await axios.get(`${BASE_URL}supplier`, { withCredentials: true });
      if (supplierRs.status === 200) {
        setSuppliers(() => supplierRs.data.suppliers.filter(supplier => supplier.isActive !== false));
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "no supplier found") {
        console.log("no supplier found");
      } else {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-11/12 lg:w-4/5 my-6 mx-auto max-w-6xl"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Add New Product
              </h3>
              <button
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                onClick={() => setOpenModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {/* Product Info Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Product Information
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="Name"
                      value={newProduct.Name}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2.5 text-base border ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
                      placeholder="Enter product name"
                    />
                    {errors.Name && (
                      <div className="text-red-500 text-xs mt-1">{errors.Name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                    <textarea
                      name="Description"
                      value={newProduct.Description}
                      onChange={handleChange}
                      rows="3"
                      className={`block w-full px-3 py-2.5 text-base border ${errors.Description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
                      placeholder="Enter product description"
                    ></textarea>
                    {errors.Description && (
                      <div className="text-red-500 text-xs mt-1">{errors.Description}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price (LKR)</label>
                      <input
                        type="number"
                        name="BuyingPrice"
                        value={newProduct.BuyingPrice}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.BuyingPrice ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
                        placeholder="Enter buying price"
                      />
                      {errors.BuyingPrice && (
                        <div className="text-red-500 text-xs mt-1">{errors.BuyingPrice}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (LKR)</label>
                      <input
                        type="number"
                        name="SellingPrice"
                        value={newProduct.SellingPrice}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.SellingPrice ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
                        placeholder="Enter selling price"
                      />
                      {errors.SellingPrice && (
                        <div className="text-red-500 text-xs mt-1">{errors.SellingPrice}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                      <div className="relative">
                        <select
                          name="SupplierID"
                          value={newProduct.SupplierID}
                          onChange={handleChange}
                          className={`block w-full pl-3 pr-10 py-2.5 text-base border ${errors.SupplierID ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
                        >
                          <option value="0">Select Supplier</option>
                          {suppliers.map((supplier) => (
                            <option key={supplier.SupplierID} value={supplier.SupplierID}>
                              {supplier.Name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg> */}
                        </div>
                      </div>
                      {errors.SupplierID && (
                        <div className="text-red-500 text-xs mt-1">{errors.SupplierID}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <div className="relative">
                        <select
                          name="CategoryID"
                          value={newProduct.CategoryID}
                          onChange={handleChange}
                          className={`block w-full pl-3 pr-10 py-2.5 text-base border ${errors.CategoryID ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
                        >
                          <option value="0">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.CategoryID} value={category.CategoryID}>
                              {category.Name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg> */}
                        </div>
                      </div>
                      {errors.CategoryID && (
                        <div className="text-red-500 text-xs mt-1">{errors.CategoryID}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                onClick={handleSubmit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ProductAddModal;