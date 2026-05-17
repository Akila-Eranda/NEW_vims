import React, { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { getStoredTokens } from "auth/tokenService";

function UserEditModal({ setOpenModal, userDataInfo, editUser }) {
    const [errors, setErrors] = useState({});
    const [currUserRole, setCurrUserRole] = useState(null);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [userInfo, setUserInfo] = useState({
        id: userDataInfo.id,
        firstname: userDataInfo.firstname,
        lastname: userDataInfo.lastname,
        username: userDataInfo.username,
        email: userDataInfo.email,
        password: "",
        role: userDataInfo.role,
        active: userDataInfo.active,
        birthday: new Date(userDataInfo.birthday).toISOString().split('T')[0],
        gender: userDataInfo.gender,
    });

    const { setAuth } = useAuth();

    useEffect(() => {
        // const sessionUser = JSON.parse(sessionStorage.getItem('user'))?.user;
        // if (sessionUser) {
        //     setCurrUserRole(sessionUser.role);
        //     setIsCurrentUser(sessionUser.id === userDataInfo.id);
        // }

        const sessionUser = getStoredTokens()

        // console.log(sessionUser.user)

        if (sessionUser) {
            setCurrUserRole(sessionUser.user.role)
            setIsCurrentUser(sessionUser.user.id === userDataInfo.id)
        }

    }, [userDataInfo.id]);

    const handleChange = (e) => {
        // Only allow changes if user is admin
        if (currUserRole !== "admin") return;
        
        setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Only allow submission if user is admin
        if (currUserRole !== "admin") {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Only administrators can edit user information.',
            });
            return;
        }

        const validationErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!userInfo.firstname.trim()) {
            validationErrors.firstname = "First name is required";
        }
        if (!userInfo.lastname.trim()) {
            validationErrors.lastname = "Last name is required";
        }
        if (!userInfo.username.trim()) {
            validationErrors.username = "Username is required";
        }

        if (!userInfo.email.trim()) {
            validationErrors.email = "Email is required";
        } else if (!emailRegex.test(userInfo.email)) {
            validationErrors.email = "Please enter a valid email address";
        }

        if (userInfo.password && !passwordRegex.test(userInfo.password)) {
            validationErrors.password = "Password must include uppercase, lowercase, number, and symbol";
        }

        if (!userInfo.birthday) {
            validationErrors.birthday = "Date of birth is required";
        } else {
            const selectedDate = new Date(userInfo.birthday);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate >= today) {
                validationErrors.birthday = "Birthday must be before today";
            }
        }

        if (!userInfo.gender) validationErrors.gender = "Gender is required";

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            editUser(userInfo);
        }
    };

    const isFieldDisabled = (fieldName) => {
        return currUserRole !== "admin";
    };

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-11/12 md:w-4/5 lg:w-3/5 my-6 mx-auto max-w-3xl"
                >
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {currUserRole === "admin" ? "Edit User" : "View User Profile"}
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

                        {/* Access Restriction Notice for Non-Admin Users */}
                        {currUserRole !== "admin" && (
                            <div className="bg-red-50 p-4 border-b border-red-200">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-red-700 text-sm font-medium">
                                        You are viewing this profile in read-only mode. Only administrators can edit user information.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Main Form */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                {/* Personal Information Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Personal Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstname"
                                                className={`block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                    isFieldDisabled("firstname") ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                placeholder="Enter First Name"
                                                value={userInfo.firstname}
                                                onChange={handleChange}
                                                disabled={isFieldDisabled("firstname")}
                                            />
                                            {errors.firstname && (
                                                <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastname"
                                                className={`block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                    isFieldDisabled("lastname") ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                placeholder="Enter Last Name"
                                                value={userInfo.lastname}
                                                onChange={handleChange}
                                                disabled={isFieldDisabled("lastname")}
                                            />
                                            {errors.lastname && (
                                                <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Additional Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="birthday"
                                                className={`block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                    isFieldDisabled("birthday") ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                value={userInfo.birthday}
                                                onChange={handleChange}
                                                disabled={isFieldDisabled("birthday")}
                                            />
                                            {errors.birthday && (
                                                <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Gender
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="gender"
                                                    className={`block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                        isFieldDisabled("gender") ? "bg-gray-100 cursor-not-allowed" : ""
                                                    }`}
                                                    value={userInfo.gender}
                                                    onChange={handleChange}
                                                    disabled={isFieldDisabled("gender")}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.gender && (
                                                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Account Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                className={`block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                    isFieldDisabled("username") ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                placeholder="Enter Username"
                                                value={userInfo.username}
                                                onChange={handleChange}
                                                disabled={isFieldDisabled("username")}
                                            />
                                            {errors.username && (
                                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                    isFieldDisabled("email") ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                placeholder="Enter Email Address"
                                                value={userInfo.email}
                                                onChange={handleChange}
                                                disabled={isFieldDisabled("email")}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                className={`block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                    isFieldDisabled("password") ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                placeholder="Leave empty to keep current password"
                                                value={userInfo.password}
                                                onChange={handleChange}
                                                disabled={isFieldDisabled("password")}
                                            />
                                            {errors.password && (
                                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                User Role
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="role"
                                                    className={`block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                        isFieldDisabled("role") ? "bg-gray-100 cursor-not-allowed" : ""
                                                    }`}
                                                    value={userInfo.role}
                                                    onChange={handleChange}
                                                    disabled={isFieldDisabled("role")}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Status Section - Only visible to admins */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Account Status
                                    </h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="active"
                                                className={`block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 ${
                                                    isFieldDisabled("active") ? "bg-gray-100 cursor-not-allowed" : ""
                                                }`}
                                                value={userInfo.active}
                                                onChange={handleChange}
                                                disabled={isFieldDisabled("active")}
                                            >
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
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
                                {currUserRole === "admin" ? "Cancel" : "Close"}
                            </button>
                            {/* Only show save button if user is admin */}
                            {currUserRole === "admin" && (
                                <button
                                    type="button"
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                                    onClick={handleSubmit}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Update User
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default UserEditModal;