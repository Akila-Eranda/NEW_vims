// import React, { useState } from "react";

// function WarehouseAddModal({ setOpenModal, addWarehouse }) {
//     const [errors, setErrors] = useState({});
//     const [newWarehouse, setNewWarehouse] = useState({
//         WarehouseName: "",
//         Address: "",
//     });

//     const handleChange = (e) => {
//         setNewWarehouse((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const validationErrors = {};

//         if (!newWarehouse.WarehouseName.trim()) {
//             validationErrors.WarehouseName = "Warehouse Name is required";
//         }

//         if (!newWarehouse.Address.trim()) {
//             validationErrors.Address = "Warehouse Address is required"; 
//         }

//         setErrors(validationErrors);

//         if (Object.keys(validationErrors).length === 0) {
//             addWarehouse(newWarehouse);
//             setOpenModal(false);
//         }
//     };

//     return (
//         <>
//             <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 pt-80 md:pt-0 z-50 outline-none focus:outline-none">
//                 <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xl">

//                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">

//                         <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//                             <h3 className="text-3xl text-center font-semibold">
//                                 Add New Warehouse Location
//                             </h3>
//                             <button
//                                 className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                                 onClick={() => setOpenModal(false)}
//                             >
//                                 <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
//                                     ×
//                                 </span>
//                             </button>
//                         </div>
//                         <div className="relative p-6">
//                             <form className="space-y-4" onSubmit={handleSubmit}>
//                                 <div>
//                                     <label htmlFor="WarehouseName" className="font-bold block my-2">
//                                         Warehouse Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="WarehouseName" 
//                                         value={newWarehouse.WarehouseName}
//                                         onChange={handleChange}
//                                         className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                         placeholder="Enter Warehouse Name"
//                                     />
//                                     {errors.WarehouseName && (
//                                         <div className="text-red-500 text-sm mt-1">{errors.WarehouseName}</div>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Address" className="font-bold block my-2">
//                                         Warehouse Address
//                                     </label>
//                                     <textarea
//                                         name="Address" 
//                                         value={newWarehouse.Address}
//                                         onChange={handleChange}
//                                         className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                         placeholder="Enter Warehouse Address"
//                                     ></textarea>
//                                     {errors.Address && (
//                                         <div className="text-red-500 text-sm mt-1">{errors.Address}</div>
//                                     )}
//                                 </div>
//                                 <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//                                     <button
//                                         className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                                         type="button"
//                                         onClick={() => setOpenModal(false)}
//                                     >
//                                         Close
//                                     </button>
//                                     <button
//                                         className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                                         type="submit"
//                                     >
//                                         Add New Warehouse
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//         </>
//     );
// }

// export default WarehouseAddModal;

import React, { useState } from "react";
import { motion } from "framer-motion";

function WarehouseAddModal({ setOpenModal, addWarehouse }) {
  const [errors, setErrors] = useState({});
  const [newWarehouse, setNewWarehouse] = useState({
    WarehouseName: "",
    Address: "",
  });

  const handleChange = (e) => {
    setNewWarehouse((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!newWarehouse.WarehouseName.trim()) {
      validationErrors.WarehouseName = "Warehouse Name is required";
    }

    if (!newWarehouse.Address.trim()) {
      validationErrors.Address = "Warehouse Address is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      addWarehouse(newWarehouse);
      setOpenModal(false);
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3
      }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.01,
      transition: { duration: 0.2 }
    },
    blur: { 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="relative w-11/12 md:w-3/5 my-6 mx-auto max-w-2xl"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Add New Warehouse Location
              </h3>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="text-white rounded-full p-2 transition-all duration-200"
                onClick={() => setOpenModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Warehouse Information Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Warehouse Information
                  </h4>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warehouse Name <span className="text-red-500">*</span>
                      </label>
                      <motion.input
                        variants={inputVariants}
                        whileFocus="focus"
                        animate="blur"
                        type="text"
                        name="WarehouseName"
                        value={newWarehouse.WarehouseName}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.WarehouseName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                        placeholder="Enter Warehouse Name"
                      />
                      {errors.WarehouseName && (
                        <motion.div 
                          className="text-red-500 text-sm mt-1 flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {errors.WarehouseName}
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Warehouse Address <span className="text-red-500">*</span>
                      </label>
                      <motion.textarea
                        variants={inputVariants}
                        whileFocus="focus"
                        animate="blur"
                        name="Address"
                        value={newWarehouse.Address}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.Address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                        placeholder="Enter Warehouse Address"
                        rows="4"
                      ></motion.textarea>
                      {errors.Address && (
                        <motion.div 
                          className="text-red-500 text-sm mt-1 flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {errors.Address}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
                
                {/* Footer */}
                <motion.div 
                  className="bg-gray-50 pt-4 pb-3 -mx-6 -mb-6 px-6 flex items-center justify-end space-x-3 border-t"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: '#f3f4f6' }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: '#2563eb' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Warehouse
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default WarehouseAddModal;