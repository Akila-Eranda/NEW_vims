// import React from "react";

// function ProductInfoModal({ prodInfo, setOpenModal }) {
//   return (
//     <>
//       <div
//         className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
//         // onClick={() => setShowModal(false)}
//       >
//         <div className="relative w-auto my-6 mx-auto max-w-3xl">
//           {/*content*/}
//           <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
//             {/*header*/}
//             <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//               <h3 className="text-3xl font-semibold"> Product Name: {prodInfo.Name} </h3>
//               <button
//                 className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                 // onClick={() => setShowModal(false)}
//               >
//                 <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
//                   ×
//                 </span>
//               </button>
//             </div>
//             {/*body*/}
//             <div className="relative p-6 flex-auto">
//               <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
//                 <strong>Product Description: </strong> {prodInfo.Description}
//               </p>
//               <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
//                 <strong>Quantity: </strong> {prodInfo.QuantityInStock}
//               </p>
//               <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
//                 <strong>Unit Price: </strong> {prodInfo.SellingPrice} LKR
//               </p>
//               <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
//                 <strong>Category: </strong> {prodInfo.CategoryID} 
//               </p>
//               <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
//                 <strong>Supplier: </strong> {prodInfo.SupplierID} 
//               </p>
//             </div>
//             {/*footer*/}
//             <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//               <button
//                 className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                 type="button"
//                 onClick={() => setOpenModal( () => null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//     </>
//   );
// }

// export default ProductInfoModal;

import React from "react";
import { motion } from "framer-motion"; // You may need to install this package

function ProductInfoModal({ prodInfo, setOpenModal }) {
  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-11/12 md:w-auto my-6 mx-auto max-w-3xl"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {prodInfo.Name}
              </h3>
              <button
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                onClick={() => setOpenModal(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Product Information Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Product Information
                </h4>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Product ID:</span>
                        <span className="text-base font-semibold text-gray-800">{prodInfo.ProductID}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Quantity:</span>
                        <span className="text-base text-gray-800">{prodInfo.QuantityInStock}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Category:</span>
                        <span className="text-base text-gray-800">{prodInfo.CategoryID}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Unit Price:</span>
                        <span className="text-base font-semibold text-gray-800">{prodInfo.SellingPrice} LKR</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Supplier:</span>
                        <span className="text-base text-gray-800">{prodInfo.SupplierID}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Product Description
                </h4>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-base text-gray-700">
                    {prodInfo.Description || "No description available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t">
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                onClick={() => setOpenModal(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ProductInfoModal;