import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function CustomerEditModal({ setOpenModal, customerInfo, editCustomer }) {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [customerData, setCustomerData] = useState({
        CustomerID: customerInfo.CustomerID,
        Name: customerInfo.Name,
        CompanyName: customerInfo.CompanyName,
        Phone: customerInfo.Phone,
        Email: customerInfo.Email,
        Note: customerInfo.Note,
        AddressId: customerInfo.CustomerAddressID,
        Street: customerInfo.Street || "",
        City: customerInfo.City || "",
        State: customerInfo.State || "",
        PostalCode: customerInfo.PostalCode || "",
        Country: customerInfo.Country || "",
    });

    useEffect(() => {
        const loadAddressData = async () => {
            setIsLoading(true);
            try {
                // const response = await axios.get(
                //     `${BASE_URL}customeraddress/${customerInfo.CustomerAddressID}`,
                //     { withCredentials: true }
                // );
                const api = createAxiosInstance();
                const response = await api.get(`customeraddress/${customerInfo.CustomerAddressID}`);
                const address = response.data.customerAddress;
                setCustomerData(prev => ({
                    ...prev,
                    Street: address.Street,
                    City: address.City,
                    State: address.State,
                    PostalCode: address.PostalCode,
                    Country: address.Country,
                }));
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to load customer address. Please try again.",
                    icon: "error",
                    background: "#f8fafc",
                    confirmButtonColor: "#3b82f6"
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadAddressData();
    }, [customerInfo.CustomerAddressID]);

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setCustomerData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        
        if (!customerData.Name.trim()) {
            validationErrors.Name = "Customer Name is required";
        }
        
        if (!customerData.CompanyName.trim()) {
            validationErrors.CompanyName = "Contact Name is required";
        }
        
        if (!customerData.Phone.trim()) {
            validationErrors.Phone = "Phone is required";
        } else if (customerData.Phone.length > 20) {
            validationErrors.Phone = "Phone number cannot exceed 20 numbers";
        } else if (!/^\d+$/.test(customerData.Phone)) {
            validationErrors.Phone = "Phone number must contain only numbers";
        }
        
        // if (!customerData.Email.trim()) {
        //     validationErrors.Email = "Email is required";
        // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.Email)) {
        //     validationErrors.Email = "Please enter a valid email address";
        // }
        
        if (!customerData.Street.trim()) {
            validationErrors.Street = "Street is required";
        }
        
        if (!customerData.City.trim()) {
            validationErrors.City = "City is required";
        }
        
        // if (!customerData.State.trim()) {
        //     validationErrors.State = "State is required";
        // }
        
        // if (!customerData.PostalCode.trim()) {
        //     validationErrors.PostalCode = "Postal Code is required";
        // }
        
        // if (!customerData.Country.trim()) {
        //     validationErrors.Country = "Country is required";
        // }
        
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            await editCustomer(customerData);
            Swal.fire({
                title: "Success",
                text: "Customer updated successfully",
                icon: "success",
                background: "#f8fafc",
                confirmButtonColor: "#3b82f6"
            });
            setOpenModal(false);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Failed to update customer. Please try again.",
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Customer
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
                            {isLoading ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
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
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter Customer Name"
                                                    value={customerData.Name}
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
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors.CompanyName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter Company Name"
                                                    value={customerData.CompanyName}
                                                    onChange={handleCustomerChange}
                                                />
                                                {errors.ContactName && (
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
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors.Phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter Phone Number"
                                                    value={customerData.Phone}
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
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors.Email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter Email Address"
                                                    value={customerData.Email}
                                                    onChange={handleCustomerChange}
                                                />
                                                {errors.Email && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.Email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

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
                                            value={customerData.Note}
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
                                                className={`block w-full px-3 py-2.5 text-base border ${errors.Street ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                placeholder="Enter Street Address"
                                                value={customerData.Street}
                                                onChange={handleCustomerChange}
                                            />
                                            {errors.Street && (
                                                <p className="text-red-500 text-xs mt-1">{errors.Street}</p>
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
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors.City ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter City"
                                                    value={customerData.City}
                                                    onChange={handleCustomerChange}
                                                />
                                                {errors.City && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.City}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    State/Province
                                                </label>
                                                <input
                                                    type="text"
                                                    name="State"
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors.State ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter State/Province"
                                                    value={customerData.State}
                                                    onChange={handleCustomerChange}
                                                />
                                                {errors.State && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.State}</p>
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
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors.PostalCode ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter Postal Code"
                                                    value={customerData.PostalCode}
                                                    onChange={handleCustomerChange}
                                                />
                                                {errors.PostalCode && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.PostalCode}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    name="Country"
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors.Country ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter Country"
                                                    value={customerData.Country}
                                                    onChange={handleCustomerChange}
                                                />
                                                {errors.Country && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.Country}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
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
                                className={`px-6 py-2 text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center`}
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Update Customer
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default CustomerEditModal;