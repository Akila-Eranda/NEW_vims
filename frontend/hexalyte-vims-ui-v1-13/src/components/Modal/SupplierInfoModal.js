import React from "react";
import { motion } from "framer-motion"; // You may need to install this package

function SupplierInfoModal({ setOpenModal, supplier }) {
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
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Supplier Information
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
                            {/* Company Information Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Company Information
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <span className="text-sm font-medium text-gray-600 w-32">Supplier Name:</span>
                                        <span className="text-base text-gray-900 font-medium">{supplier?.Name || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Contact Information
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-600 w-32">Company Name:</span>
                                            <span className="text-base text-gray-900">{supplier?.CompanyName || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-600 w-32">Contact Title:</span>
                                            <span className="text-base text-gray-900">{supplier?.ContactTitle || 'N/A'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-600 w-16">Phone:</span>
                                            <span className="text-base text-gray-900">{supplier?.Phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-600 w-16">Email:</span>
                                            <span className="text-base text-gray-900">{supplier?.Email || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Address Information
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <span className="text-sm font-medium text-gray-600 w-20 mt-1">Address:</span>
                                        <span className="text-base text-gray-900 flex-1">
                                            {supplier?.Address ? (
                                                <span className="whitespace-pre-line">{supplier.Address}</span>
                                            ) : (
                                                'N/A'
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Additional Details
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-600 w-24">Supplier ID:</span>
                                            <span className="text-base text-gray-900">{supplier?.id || supplier?.SupplierID || 'Auto-generated'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-600 w-24">Status:</span>
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                                onClick={() => setOpenModal(false)}
                            >
                                Close
                            </button>
                           
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default SupplierInfoModal;