import React, { useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package

function WarehouseEditModal({ setOpenModal, warehouseInfo, editWarehouse }) {
  const [errors, setErrors] = useState({});
  const [warehouseData, setWarehouseData] = useState({
    LocationID: warehouseInfo.LocationID,
    WarehouseName: warehouseInfo.WarehouseName,
    Address: warehouseInfo.Address,
  });

  const handleChange = (e) => {
    setWarehouseData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!warehouseData.WarehouseName.trim()) {
      validationErrors.WarehouseName = "Warehouse Name is required";
    }

    if (!warehouseData.Address.trim()) {
      validationErrors.Address = "Warehouse Address is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      editWarehouse(warehouseData);
      setOpenModal(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-11/12 md:w-3/5 my-6 mx-auto max-w-2xl"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Warehouse: {warehouseInfo.WarehouseName}
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Warehouse Information Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Warehouse Information
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warehouse ID
                      </label>
                      <input
                        type="text"
                        value={warehouseData.LocationID}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warehouse Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="WarehouseName"
                        value={warehouseData.WarehouseName}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.WarehouseName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                        placeholder="Enter Warehouse Name"
                      />
                      {errors.WarehouseName && (
                        <div className="text-red-500 text-sm mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {errors.WarehouseName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warehouse Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="Address"
                        value={warehouseData.Address}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.Address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                        placeholder="Enter Warehouse Address"
                        rows="4"
                      ></textarea>
                      {errors.Address && (
                        <div className="text-red-500 text-sm mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {errors.Address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="bg-gray-50 pt-4 pb-3 -mx-6 -mb-6 px-6 flex items-center justify-end space-x-3 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Update Warehouse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default WarehouseEditModal;