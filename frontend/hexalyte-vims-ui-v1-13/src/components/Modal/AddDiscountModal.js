// import React, { useState } from "react";
// import { motion } from "framer-motion"; // You may need to install this package

// function AddDiscountModal({ setOpenModal, addCategory }) {
//   const [errors, setErrors] = useState({});
//   const [newCategory, setNewCategory] = useState({
//     Name: "",
//     Description: "",
//   });

//   const handleChange = (e) => {
//     setNewCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = {};
    
//     if (!newCategory.Name.trim()) {
//       validationErrors.Name = "Category Name is required";
//     }
    
//     if (!newCategory.Description.trim()) {
//       validationErrors.Description = "Category Description is required";
//     }
    
//     setErrors(validationErrors);
    
//     if (Object.keys(validationErrors).length === 0) {
//       addCategory(newCategory);
//       setOpenModal(false);
//     }
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="relative w-11/12 md:w-3/5 my-6 mx-auto max-w-2xl"
//         >
//           <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-2xl font-bold text-white flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//                 </svg>
//                 Add New Discount
//               </h3>
//               <button
//                 className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
//                 onClick={() => setOpenModal(false)}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Main Content */}
//             <div className="p-6">
//               <form className="space-y-6" onSubmit={handleSubmit}>
//                 {/* Category Information Section */}
//                 <div className="mb-6">
//                   <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Category Information
//                   </h4>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Category Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="Name"
//                         value={newCategory.Name}
//                         onChange={handleChange}
//                         className={`block w-full px-3 py-2.5 text-base border ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
//                         placeholder="Enter Category Name"
//                       />
//                       {errors.Name && (
//                         <div className="text-red-500 text-sm mt-1 flex items-center">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                           </svg>
//                           {errors.Name}
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Category Description <span className="text-red-500">*</span>
//                       </label>
//                       <textarea
//                         name="Description"
//                         value={newCategory.Description}
//                         onChange={handleChange}
//                         className={`block w-full px-3 py-2.5 text-base border ${errors.Description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
//                         placeholder="Enter Category Description"
//                         rows="4"
//                       ></textarea>
//                       {errors.Description && (
//                         <div className="text-red-500 text-sm mt-1 flex items-center">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                           </svg>
//                           {errors.Description}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Footer */}
//                 <div className="bg-gray-50 pt-4 pb-3 -mx-6 -mb-6 px-6 flex items-center justify-end space-x-3 border-t">
//                   <button
//                     type="button"
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
//                     onClick={() => setOpenModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     Add Category
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// }

// export default AddDiscountModal;
import React, { useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package

function AddDiscountModal({ setOpenModal, addDiscount }) {
  const [errors, setErrors] = useState({});
  const [newDiscount, setNewDiscount] = useState({
    Amount: "",
    PurchaseOrders: false,
    SalesOrders: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNewDiscount((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = () => {
    const validationErrors = {};
    
    if (!newDiscount.Amount.trim()) {
      validationErrors.Amount = "Discount Amount is required";
    } 
    
    // else if (isNaN(newDiscount.Amount) || parseFloat(newDiscount.Amount) <= 0) {
    //   validationErrors.Amount = "Please enter a valid amount greater than 0";
    // }
    
    if (!newDiscount.PurchaseOrders && !newDiscount.SalesOrders) {
      validationErrors.OrderTypes = "Please select at least one order type";
    }
    
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      addDiscount(newDiscount);
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                </svg>
                Add New Discount
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
              <div className="space-y-6">
                {/* Discount Information Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Discount Information
                  </h4>
                  
                  <div className="space-y-6">
                    {/* Amount Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="Amount"
                          value={newDiscount.Amount}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className={`block w-full pl-8 pr-3 py-2.5 text-base border ${errors.Amount ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.Amount && (
                        <div className="text-red-500 text-sm mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {errors.Amount}
                        </div>
                      )}
                    </div>

                    {/* Order Types Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Apply to Order Types <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <input
                            type="checkbox"
                            name="PurchaseOrders"
                            checked={newDiscount.PurchaseOrders}
                            onChange={handleChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="ml-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Purchase Orders</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <input
                            type="checkbox"
                            name="SalesOrders"
                            checked={newDiscount.SalesOrders}
                            onChange={handleChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="ml-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Sales Orders</span>
                          </div>
                        </div>
                      </div>
                      {errors.OrderTypes && (
                        <div className="text-red-500 text-sm mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {errors.OrderTypes}
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
                    type="button"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                    onClick={handleSubmit}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Discount
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default AddDiscountModal;