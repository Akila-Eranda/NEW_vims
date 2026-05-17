// import React, { useState } from "react";

// function SupplierAddModal({ setOpenModal, editSupplier, supplierInfo }) {
//     const [errors, setErrors] = useState({});
//     const [supplierData, setSupplierData] = useState({
//         SupplierID: supplierInfo.SupplierID,
//         Name: supplierInfo.Name,
//         ContactName: supplierInfo.ContactName,
//         Phone: supplierInfo.Phone,
//         Email: supplierInfo.Email,
//         Address: supplierInfo.Address,
//     });

//     const handleChange = (e) => {
//         setSupplierData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const validationErrors = {};

//         if (!supplierData.Name.trim()) {
//             validationErrors.Name = "Supplier Name is required";
//         }
//         if (!supplierData.ContactName.trim()) {
//             validationErrors.ContactName = "Contact Name is required";
//         }
//         if (!supplierData.Phone.trim()) {
//             validationErrors.Phone = "Phone is required";
//         } else if (supplierData.Phone.length > 20) {
//             validationErrors.Phone = "Phone number cannot exceed 20 numbers";
//         } else if (!/^\d+$/.test(supplierData.Phone)) {
//             validationErrors.Phone = "Phone number must contain only numbers";
//         }
//         if (!supplierData.Email.trim()) {
//             validationErrors.Email = "Email is required";
//         } else if (!/^\S+@\S+\.\S+$/.test(supplierData.Email)) {
//             validationErrors.Email = "Email is invalid";
//         }
//         if (!supplierData.Address.trim()) {
//             validationErrors.Address = "Address is required";
//         }

//         setErrors(validationErrors);

//         if (Object.keys(validationErrors).length === 0) {
//             editSupplier(supplierData);
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
//                                 Update Supplier
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
//                                 <div className="w-full flex flex-col md:flex-row gap-2">
//                                     <div className="w-full">
//                                         <label htmlFor="Name" className="font-bold block my-2">
//                                             Supplier Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="Name"
//                                             value={supplierData.Name}
//                                             onChange={handleChange}
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Enter Supplier Name"
//                                         />
//                                         {errors.Name && (
//                                             <div className="text-red-500 text-sm mt-1">{errors.Name}</div>
//                                         )}
//                                     </div>  
//                                     <div className="w-full">
//                                         <label htmlFor="ContactName" className="font-bold block my-2">
//                                             Contact Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="ContactName"
//                                             value={supplierData.ContactName}
//                                             onChange={handleChange}
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Enter Contact Name"
//                                         />
//                                         {errors.ContactName && (
//                                             <div className="text-red-500 text-sm mt-1">{errors.ContactName}</div>
//                                         )}
//                                     </div>
//                                 </div>
                                
//                                 {/* <div>
//                                     <label htmlFor="ContactTitle" className="font-bold block my-2">
//                                         Contact Title
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="ContactTitle"
//                                         value={supplierInfo.ContactTitle}
//                                         onChange={handleChange}
//                                         className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                         placeholder="Enter Contact Title"
//                                     />
//                                     {errors.ContactTitle && (
//                                         <div className="text-red-500 text-sm mt-1">{errors.ContactTitle}</div>
//                                     )}
//                                 </div> */}

//                                 <div className="w-full flex flex-col md:flex-row gap-2">
//                                     <div className="w-full">
//                                         <label htmlFor="Phone" className="font-bold block my-2">
//                                             Phone
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="Phone"
//                                             value={supplierData.Phone}
//                                             onChange={handleChange}
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Enter Phone Number"
//                                         />
//                                         {errors.Phone && (
//                                             <div className="text-red-500 text-sm mt-1">{errors.Phone}</div>
//                                         )}
//                                     </div>
//                                     <div className="w-full">
//                                         <label htmlFor="Email" className="font-bold block my-2">
//                                             Email
//                                         </label>
//                                         <input
//                                             type="email"
//                                             name="Email"
//                                             value={supplierData.Email}
//                                             onChange={handleChange}
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Enter Email Address"
//                                         />
//                                         {errors.Email && (
//                                             <div className="text-red-500 text-sm mt-1">{errors.Email}</div>
//                                         )}
//                                     </div>
//                                 </div>
                                
//                                 <div>
//                                     <label htmlFor="Address" className="font-bold block my-2">
//                                         Address
//                                     </label>
//                                     <textarea
//                                         name="Address"
//                                         value={supplierData.Address}
//                                         onChange={handleChange}
//                                         className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                         placeholder="Enter Full Address"
//                                         rows="3"
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
//                                         Update Supplier
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

// export default SupplierAddModal;

import React, { useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package
import Swal from "sweetalert2";

function SupplierEditModal({ setOpenModal, editSupplier, supplierInfo }) {
    const [errors, setErrors] = useState({});
    const [supplierData, setSupplierData] = useState({
        SupplierID: supplierInfo.SupplierID,
        Name: supplierInfo.Name,
        CompanyName: supplierInfo.CompanyName,
        ContactTitle: supplierInfo.ContactTitle || "",
        Phone: supplierInfo.Phone,
        Email: supplierInfo.Email,
        Address: supplierInfo.Address,
    });

    const handleChange = (e) => {
        setSupplierData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!supplierData.Name.trim()) {
            validationErrors.Name = "Supplier Name is required";
        }
        
        if (!supplierData.CompanyName.trim()) {
            validationErrors.CompanyName = "Contact Name is required";
        }
        
        if (!supplierData.Phone.trim()) {
            validationErrors.Phone = "Phone is required";
        } else if (supplierData.Phone.length > 20) {
            validationErrors.Phone = "Phone number cannot exceed 20 numbers";
        } else if (!/^\d+$/.test(supplierData.Phone)) {
            validationErrors.Phone = "Phone number must contain only numbers";
        }
        
        if (!supplierData.Email.trim()) {
            validationErrors.Email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(supplierData.Email)) {
            validationErrors.Email = "Email is invalid";
        }

        if (!supplierData.Address.trim()) {
            validationErrors.Address = "Address is required";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                editSupplier(supplierData);
                Swal.fire({
                    title: "Success",
                    text: "Supplier updated successfully",
                    icon: "success",
                    background: "#f8fafc",
                    confirmButtonColor: "#3b82f6"
                });
                setOpenModal(false);
            } catch (error) {
                console.error("Error updating supplier:", error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to update supplier. Please try again.",
                    icon: "error",
                    background: "#f8fafc",
                    confirmButtonColor: "#3b82f6"
                });
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-11/12 md:w-4/5 lg:w-3/5 my-6 mx-auto max-w-4xl"
                >
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Update Supplier
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

                        {/* Main Form */}
                        <div className="p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Company Information Section */}
                                <div className="mb-4">
                                    <h4 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Company Information
                                    </h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Supplier Name
                                        </label>
                                        <input
                                            type="text"
                                            name="Name"
                                            className={`block w-full px-3 py-2 text-base border ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                            placeholder="Enter Supplier Name or Company"
                                            value={supplierData.Name}
                                            onChange={handleChange}
                                        />
                                        {errors.Name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.Name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="mb-4">
                                    <h4 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Contact Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                name="CompanyName"
                                                className={`block w-full px-3 py-2 text-base border ${errors.CompanyName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                placeholder="Enter Contact Person's Name"
                                                value={supplierData.CompanyName}
                                                onChange={handleChange}
                                            />
                                            {errors.CompanyName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.CompanyName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contact Title
                                            </label>
                                            <input
                                                type="text"
                                                name="ContactTitle"
                                                className="block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Contact's Job Title"
                                                value={supplierData.ContactTitle}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                name="Phone"
                                                className={`block w-full px-3 py-2 text-base border ${errors.Phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                placeholder="Enter Phone Number"
                                                value={supplierData.Phone}
                                                onChange={handleChange}
                                            />
                                            {errors.Phone && (
                                                <p className="text-red-500 text-xs mt-1">{errors.Phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="Email"
                                                className={`block w-full px-3 py-2 text-base border ${errors.Email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                placeholder="Enter Email Address"
                                                value={supplierData.Email}
                                                onChange={handleChange}
                                            />
                                            {errors.Email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.Email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information Section */}
                                <div className="mb-4">
                                    <h4 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Address Information
                                    </h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Address
                                        </label>
                                        <textarea
                                            name="Address"
                                            className={`block w-full px-3 py-2 text-base border ${errors.Address ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                            placeholder="Enter Full Address"
                                            rows="3"
                                            value={supplierData.Address}
                                            onChange={handleChange}
                                        ></textarea>
                                        {errors.Address && (
                                            <p className="text-red-500 text-xs mt-1">{errors.Address}</p>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-3 flex items-center justify-end space-x-3 border-t">
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Update Supplier
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default SupplierEditModal;