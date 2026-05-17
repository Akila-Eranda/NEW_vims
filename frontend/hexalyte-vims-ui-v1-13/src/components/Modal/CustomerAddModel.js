import React, { useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package
import Swal from "sweetalert2";

function CustomerAddModal({ setOpenModal, addCustomer }) {
    const [errors, setErrors] = useState({});
    const [addressErrors, setAddressErrors] = useState({});
    
    const [newCustomer, setNewCustomer] = useState({
        Name: "",
        CompanyName: "",
        Phone: "",
        Email: "",
        Note: "",
        AddressID: null
    });

    const [newCustomerAddress, setNewCustomerAddress] = useState({
        AddressType: "test",
        Street: "",
        City: "",
        State: "",
        PostalCode: "",
        Country: ""
    });

    const handleCustomerChange = (e) => {
        setNewCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const handleAddressChange = (e) => {
        setNewCustomerAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear error when user starts typing
        if (addressErrors[e.target.name]) {
            setAddressErrors(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const validateCustomer = () => {
        const validationErrors = {};

        if (!newCustomer.Name.trim()) {
            validationErrors.Name = "Customer Name is required";
        }

        if (!newCustomer.CompanyName.trim()) {
            validationErrors.CompanyName = "Contact Name is required";
        }

        if (!newCustomer.Phone.trim()) {
            validationErrors.Phone = "Phone is required";
        } else if (newCustomer.Phone.length > 20) {
            validationErrors.Phone = "Phone number cannot exceed 20 numbers";
        } else if (!/^\d+$/.test(newCustomer.Phone)) {
            validationErrors.Phone = "Phone number must contain only numbers";
        }

        // if (!newCustomer.Email.trim()) {
        //     validationErrors.Email = "Email is required";
        // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.Email)) {
        //     validationErrors.Email = "Please enter a valid email address";
        // }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const validateAddress = () => {
        const validationErrors = {};

        if (!newCustomerAddress.Street.trim()) {
            validationErrors.Street = "Street is required";
        }

        if (!newCustomerAddress.City.trim()) {
            validationErrors.City = "City is required";
        }


        // if (!newCustomerAddress.PostalCode.trim()) {
        //     validationErrors.PostalCode = "Postal Code is required";
        // }

        // if (!newCustomerAddress.Country.trim()) {
        //     validationErrors.Country = "Country is required";
        // }

        setAddressErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isCustomerValid = validateCustomer();
        const isAddressValid = validateAddress();

        if (!isCustomerValid || !isAddressValid) {
            return;
        }

        try {
            await addCustomer(newCustomerAddress, newCustomer);
            Swal.fire({
                title: "Success",
                text: "Customer added successfully",
                icon: "success",
                background: "#f8fafc",
                confirmButtonColor: "#3b82f6"
            });
            setOpenModal(false);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Failed to add customer. Please try again.",
                icon: "error",
                background: "#f8fafc",
                confirmButtonColor: "#3b82f6"
            });
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
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add New Customer
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
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                {/* Customer Information Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Customer Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                name="Name"
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Customer Name"
                                                value={newCustomer.Name}
                                                onChange={handleCustomerChange}
                                            />
                                            {errors.Name && (
                                                <p className="text-red-500 text-xs mt-1">{errors.Name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                name="CompanyName"
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Contact Name"
                                                value={newCustomer.CompanyName}
                                                onChange={handleCustomerChange}
                                            />
                                            {errors.CompanyName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.CompanyName}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Contact Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                name="Phone"
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Phone Number"
                                                value={newCustomer.Phone}
                                                onChange={handleCustomerChange}
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
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Email Address"
                                                value={newCustomer.Email}
                                                onChange={handleCustomerChange}
                                            />
                                            {errors.Email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.Email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Notes
                                    </h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea
                                            name="Note"
                                            rows={4}
                                            className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 resize-vertical"
                                            placeholder="Enter any additional notes about the customer..."
                                            value={newCustomer.Note}
                                            onChange={handleCustomerChange}
                                        />
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
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="Street"
                                            className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                            placeholder="Enter Street Address"
                                            value={newCustomerAddress.Street}
                                            onChange={handleAddressChange}
                                        />
                                        {addressErrors.Street && (
                                            <p className="text-red-500 text-xs mt-1">{addressErrors.Street}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="City"
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter City"
                                                value={newCustomerAddress.City}
                                                onChange={handleAddressChange}
                                            />
                                            {addressErrors.City && (
                                                <p className="text-red-500 text-xs mt-1">{addressErrors.City}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State/Province
                                            </label>
                                            <input
                                                type="text"
                                                name="State"
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter State/Province"
                                                value={newCustomerAddress.State}
                                                onChange={handleAddressChange}
                                            />
                                            {addressErrors.State && (
                                                <p className="text-red-500 text-xs mt-1">{addressErrors.State}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                name="PostalCode"
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Postal Code"
                                                value={newCustomerAddress.PostalCode}
                                                onChange={handleAddressChange}
                                            />
                                            {addressErrors.PostalCode && (
                                                <p className="text-red-500 text-xs mt-1">{addressErrors.PostalCode}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="Country"
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Country"
                                                value={newCustomerAddress.Country}
                                                onChange={handleAddressChange}
                                            />
                                            {addressErrors.Country && (
                                                <p className="text-red-500 text-xs mt-1">{addressErrors.Country}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Add Customer
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default CustomerAddModal;