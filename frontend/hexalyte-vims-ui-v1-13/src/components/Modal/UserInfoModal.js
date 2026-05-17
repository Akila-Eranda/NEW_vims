
// import React from "react";
// import { motion } from "framer-motion"; // You may need to install this package

// function UserInfoModal({ userInfoModel, setOpenModal }) {
//   return (
//     <>
//       <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="relative w-11/12 md:w-auto my-6 mx-auto max-w-3xl"
//         >
//           <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//                 {userInfoModel.username}
//               </h3>
//               <button
//                 className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
//                 onClick={() => setOpenModal(null)}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6">
//               {/* Product Information Section */}
//               <div className="mb-6">
//                 <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Product Information
//                 </h4>
                
//                 <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="flex flex-col">
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Product ID:</span>
//                         <span className="text-base font-semibold text-gray-800">{userInfoModel.id}</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Quantity:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.firstname}</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Category:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.lastname}</span>
//                       </div>
//                     </div>
//                     <div className="flex flex-col">
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Unit Price:</span>
//                         <span className="text-base font-semibold text-gray-800">{userInfoModel.username} LKR</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Supplier:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.email}</span>
//                       </div>
//                     </div>
//                     <div className="flex flex-col">
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Unit Price:</span>
//                         <span className="text-base font-semibold text-gray-800">{userInfoModel.gender} LKR</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Supplier:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.role}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Product Description */}
//               <div className="mb-6">
//                 <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Product Description
//                 </h4>
                
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-base text-gray-700">
//                     {userInfoModel.Description || "No description available"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t">
//               <button
//                 type="button"
//                 className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
//                 onClick={() => setOpenModal(null)}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//                 Close
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// }

// export default UserInfoModal;





// import React from "react";
// import { motion } from "framer-motion"; // You may need to install this package

// function UserInfoModal({ userInfoModel, setOpenModal }) {
//   return (
//     <>
//       <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="relative w-11/12 md:w-auto my-6 mx-auto max-w-3xl"
//         >
//           <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-xl font-bold text-white flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 {userInfoModel.username}
//               </h3>
//               <button
//                 className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
//                 onClick={() => setOpenModal(null)}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6">
//               {/* User Information Section */}
//               <div className="mb-6">
//                 <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   User Information
//                 </h4>
                
//                 <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="flex flex-col">
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">User ID:</span>
//                         <span className="text-base font-semibold text-gray-800">{userInfoModel.id}</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">First Name:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.firstname}</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Last Name:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.lastname}</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Deleted:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.deleted}</span>
//                       </div>
//                     </div>
//                     <div className="flex flex-col">
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Email:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.email}</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Gender:</span>
//                         <span className="text-base text-gray-800">{userInfoModel.gender}</span>
                        
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Role: </span>
//                         <span className="text-base font-semibold text-gray-800">{userInfoModel.role}</span>
//                       </div>
//                       <div className="flex items-center mb-3">
//                         <span className="text-sm font-medium text-gray-500 w-32">Status: </span>
//                         <span className="text-base font-semibold text-gray-800">{userInfoModel.active}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* User Description */}
//               {/* <div className="mb-6">
//                 <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   Additional Information
//                 </h4>
                
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-base text-gray-700">
//                     {userInfoModel.description || userInfoModel.Description || "No additional information available"}
//                   </p>
//                 </div>
//               </div> */}
//             </div>

//             {/* Footer */}
            // <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t">
            //   <button
            //     type="button"
            //     className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
            //     onClick={() => setOpenModal(null)}
            //   >
            //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            //     </svg>
            //     Close
            //   </button>
            // </div>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// }

// export default UserInfoModal;




import React from "react";
import { motion } from "framer-motion"; 

function UserInfoModal({ userInfoModel, setOpenModal, }) {

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
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {userInfoModel.username}
                </h3>
                <div className="flex items-center space-x-2 ml-3">
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userInfoModel.active 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {userInfoModel.active ? 'Active' : 'Inactive'}
                  </span>
                  {/* Deleted Badge */}
                  
                </div>
              </div>
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
              {/* User Information Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  User Information
                </h4>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">User ID:</span>
                        <span className="text-base font-semibold text-gray-800">{userInfoModel.id}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">First Name:</span>
                        <span className="text-base text-gray-800">{userInfoModel.firstname}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Last Name:</span>
                        <span className="text-base text-gray-800">{userInfoModel.lastname}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Deleted:</span>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-4 py-1.8 rounded-full text-xs font-medium ${
                            userInfoModel.deleted 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            <svg className={`w-3 h-3 mr-1 ${
                              userInfoModel.deleted ? 'text-red-500' : 'text-green-500'
                            }`} fill="currentColor" viewBox="0 0 8 8">
                              <circle cx={4} cy={4} r={3} />
                            </svg>
                            {userInfoModel.deleted ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Email:</span>
                        <span className="text-base text-gray-800">{userInfoModel.email}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Gender:</span>
                        <span className="text-base text-gray-800">{userInfoModel.gender}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Role:</span>
                        <span className="text-base font-semibold text-gray-800">{userInfoModel.role}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Status:</span>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-4 py-1.8 rounded-full text-xs font-medium ${
                            userInfoModel.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <svg className={`w-3 h-3 mr-1 ${
                              userInfoModel.active ? 'text-green-500' : 'text-red-500'
                            }`} fill="currentColor" viewBox="0 0 8 8">
                              <circle cx={4} cy={4} r={3} />
                            </svg>
                            {userInfoModel.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default UserInfoModal;