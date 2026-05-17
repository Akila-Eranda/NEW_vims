// import React, { useState } from "react";

// function CategoryEditModal({ setOpenModal, categoryInfo, editCategory }) {
//     const [errors, setErrors] = useState({});
//     const [categoryData, setCategoryData] = useState({
//         CategoryID: categoryInfo.CategoryID,
//         Name: categoryInfo.Name,
//         Description: categoryInfo.Description,
//     });

//     const handleChange = (e) => {
//         setCategoryData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const validationErrors = {};

//         if (!categoryData.Name.trim()) {
//             validationErrors.Name = "Category Name is required";
//         }

//         if (!categoryData.Description.trim()) {
//             validationErrors.Description = "Category Description is required";
//         }

//         setErrors(validationErrors);

//         if (Object.keys(validationErrors).length === 0) {
//             editCategory(categoryData);
//             setOpenModal(false);
//         }
//     };

//     return (
//         <>
//             <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 pt-80 md:pt-0 z-50 outline-none focus:outline-none">
//                 <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xl">
//                     {/*content*/}
//                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">
//                         {/*header*/}
//                         <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//                             <h3 className="text-3xl text-center font-semibold">
//                                 Edit Category
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
//                                     <label htmlFor="CategoryID" className="font-bold block my-2">
//                                         Category ID
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="CategoryID"
//                                         value={categoryData.CategoryID}
//                                         onChange={handleChange}
//                                         className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                         placeholder="Enter Category ID"
//                                         readOnly
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Name" className="font-bold block my-2">
//                                         Category Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="Name"
//                                         value={categoryData.Name}
//                                         onChange={handleChange}
//                                         className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                         placeholder="Enter Category Name"
//                                     />
//                                     {errors.Name && (
//                                         <div className="text-red-500 text-sm mt-1">{errors.Name}</div>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="Description" className="font-bold block my-2">
//                                         Category Description
//                                     </label>
//                                     <textarea
//                                         name="Description"
//                                         value={categoryData.Description}
//                                         onChange={handleChange}
//                                         className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                         placeholder="Enter Category Description"
//                                     ></textarea>
//                                     {errors.Description && (
//                                         <div className="text-red-500 text-sm mt-1">{errors.Description}</div>
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
//                                         Update Category
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

// export default CategoryEditModal;

import React, { useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package

function CategoryEditModal({ setOpenModal, categoryInfo, editCategory }) {
  const [errors, setErrors] = useState({});
  const [categoryData, setCategoryData] = useState({
    CategoryID: categoryInfo.CategoryID,
    Name: categoryInfo.Name,
    Description: categoryInfo.Description,
  });

  const handleChange = (e) => {
    setCategoryData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!categoryData.Name.trim()) {
      validationErrors.Name = "Category Name is required";
    }

    if (!categoryData.Description.trim()) {
      validationErrors.Description = "Category Description is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      editCategory(categoryData);
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
                Edit Category: {categoryInfo.Name}
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
                {/* Category Information Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Category Information
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category ID
                      </label>
                      <input
                        type="text"
                        name="CategoryID"
                        value={categoryData.CategoryID}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg bg-gray-100"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="Name"
                        value={categoryData.Name}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                        placeholder="Enter Category Name"
                      />
                      {errors.Name && (
                        <div className="text-red-500 text-sm mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {errors.Name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="Description"
                        value={categoryData.Description}
                        onChange={handleChange}
                        className={`block w-full px-3 py-2.5 text-base border ${errors.Description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                        placeholder="Enter Category Description"
                        rows="4"
                      ></textarea>
                      {errors.Description && (
                        <div className="text-red-500 text-sm mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {errors.Description}
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
                    Update Category
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

export default CategoryEditModal;