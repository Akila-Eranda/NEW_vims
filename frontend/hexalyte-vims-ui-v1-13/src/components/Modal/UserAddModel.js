// import React, { useState } from "react";
// import axios from "axios";
// import { useHistory } from "react-router-dom";
// import { useAuth } from "context/AuthContext";
// import Swal from "sweetalert2";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function Register({ setOpenModal, loadUserData }) {
//     const [userInfo, setUserInfo] = useState({
//         firstname: "",
//         lastname: "",
//         username: "",
//         email: "",
//         password: "",
//         role: "user",
//         birthday: "",
//         gender: "",
//     });

//     const [errors, setErrors] = useState({});
//     const [serverError, setServerError] = useState("");

//     const history = useHistory();
//     const { setAuth } = useAuth();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserInfo((prev) => ({ ...prev, [name]: value }));
//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors((prev) => ({ ...prev, [name]: "" }));
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

//         if (!userInfo.firstname.trim()) {
//             newErrors.firstname = "First name is required";
//         } else if (userInfo.firstname.length < 2) {
//             newErrors.firstname = "First name must be at least 2 characters";
//         }

//         if (!userInfo.lastname.trim()) {
//             newErrors.lastname = "Last name is required";
//         } else if (userInfo.lastname.length < 2) {
//             newErrors.lastname = "Last name must be at least 2 characters";
//         }

//         if (!userInfo.username.trim()) {
//             newErrors.username = "Username is required";
//         } else if (userInfo.username.length < 4) {
//             newErrors.username = "Username must be at least 4 characters";
//         }

//         if (!userInfo.email.trim()) {
//             newErrors.email = "Email is required";
//         } else if (!emailRegex.test(userInfo.email)) {
//             newErrors.email = "Please enter a valid email address";
//         }

//         if (!userInfo.password) {
//             newErrors.password = "Password is required";
//         } else if (!passwordRegex.test(userInfo.password)) {
//             newErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol";
//         }

//         if (!userInfo.birthday) {
//             newErrors.birthday = "Date of birth is required";
//         } else {
//             const selectedDate = new Date(userInfo.birthday);
//             const today = new Date();
    
//             selectedDate.setHours(0, 0, 0, 0);
//             today.setHours(0, 0, 0, 0);
        
//             if (selectedDate >= today) {
//                 newErrors.birthday = "Birthday must be before today";
//             }
//         }

//         if (!userInfo.gender) {
//             newErrors.gender = "Gender is required";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const registerUser = async (e) => {
//         e.preventDefault();
//         setServerError("");

//         if (!validateForm()) return;

//         try {
//             const res = await axios.post(`${BASE_URL}auth/register`, userInfo, {
//                 withCredentials: true,
//             });

//             if (res.data.message === "Registration successful") {
//                 sessionStorage.setItem("user", JSON.stringify(res.data.user));
//                 setAuth(true);
//                 Swal.fire({
//                     title: "Success",
//                     text: "Registration successful",
//                     icon: "success"
//                 });
//                 setOpenModal(false);
//                 loadUserData();
//             }
//         } catch (error) {
//             console.error("Registration error:", error);
//             Swal.fire({
//                 title: "Error",
//                 text: error.response?.data?.message || "Registration failed. Please try again.",
//                 icon: "error"
//             });
//             setServerError(
//                 error.response?.data?.message ||
//                 "Registration failed. Please try again."
//             );
//         }
//     };

//     return (
//         <>
//            <div className="justify-center items-start flex overflow-x-hidden overflow-y-auto fixed inset-0 mt-10 md:mt-20 z-50 outline-none focus:outline-none">

// <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xl">
//     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">
//                         <div >
//                             <div className="rounded-t mb-0 px-6 py-6">
//                                 <h1 className="text-2xl font-bold text-center text-blueGray-800">
//                                     Create New Account
//                                 </h1>
//                             </div>

//                             <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
//                                 <form onSubmit={registerUser}>
//                                     <div className="font-bold block my-2">
//                                         <label
//                                             className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                                             htmlFor="firstname"
//                                         >
//                                             First Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Enter First Name"
//                                             name="firstname"
//                                             value={userInfo.firstname}
//                                             onChange={handleChange}
//                                         />
//                                         {errors.firstname && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
//                                         )}
//                                     </div>

//                                     <div className="relative w-full mb-3">
//                                         <label
//                                             className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                                             htmlFor="lastname"
//                                         >
//                                             Last Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Enter Last Name"
//                                             name="lastname"
//                                             value={userInfo.lastname}
//                                             onChange={handleChange}
//                                         />
//                                         {errors.lastname && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
//                                         )}
//                                     </div>

//                                     <div className="relative w-full mb-3">
//                                         <label
//                                             className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                                             htmlFor="birthday"
//                                         >
//                                             Date of Birth
//                                         </label>
//                                         <input
//                                             type="date"
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             name="birthday"
//                                             value={userInfo.birthday}
//                                             onChange={handleChange}
//                                         />
//                                         {errors.birthday && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>
//                                         )}
//                                     </div>

//                                     <div className="relative w-full mb-3">
//                                         <label
//                                             className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                                             htmlFor="gender"
//                                         >
//                                             Gender
//                                         </label>
//                                         <select
//                                             name="gender"
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             onChange={handleChange}
//                                             value={userInfo.gender}
//                                         >
//                                             <option value="">Select Gender</option>
//                                             <option value="male">Male</option>
//                                             <option value="female">Female</option>
//                                         </select>
//                                         {errors.gender && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
//                                         )}
//                                     </div>

//                                     <div className="relative w-full mb-3">
//                                         <label
//                                             className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                                             htmlFor="username"
//                                         >
//                                             Username
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Enter Username"
//                                             name="username"
//                                             value={userInfo.username}
//                                             onChange={handleChange}
//                                             autoComplete="username"
//                                         />
//                                         {errors.username && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.username}</p>
//                                         )}
//                                     </div>

//                                     <div className="relative w-full mb-3">
//                                         <label
//                                             className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                                             htmlFor="email"
//                                         >
//                                             Email
//                                         </label>
//                                         <input
//                                             type="email"
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Email"
//                                             name="email"
//                                             value={userInfo.email}
//                                             onChange={handleChange}
//                                         />
//                                         {errors.email && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                                         )}
//                                     </div>

//                                     <div className="relative w-full mb-3">
//                                         <label
//                                             className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                                             htmlFor="password"
//                                         >
//                                             Password
//                                         </label>
//                                         <input
//                                             type="password"
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             placeholder="Password (min 8 characters with uppercase, lowercase, number, and symbol)"
//                                             name="password"

//                                             value={userInfo.password}
//                                             onChange={handleChange}
//                                             autoComplete="new-password"
//                                         />
//                                         {errors.password && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//                                         )}
//                                     </div>

//                                     <div className="relative w-full mb-3">
//                                         <label
//                                             className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
//                                             htmlFor="role"
//                                         >
//                                             User Role
//                                         </label>
//                                         <select
//                                             name="role"
//                                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                                             onChange={handleChange}
//                                             value={userInfo.role}
//                                         >
//                                             <option value="user">User</option>
//                                             <option value="admin">Admin</option>
//                                         </select>
//                                     </div>

//                                     <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//                                         <button
//                                             className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                                             type="button"
//                                             onClick={() => setOpenModal(false)}
//                                         >
//                                             Close
//                                         </button>
//                                         <button
//                                             className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                                             type="submit"
//                                         >
//                                             Register
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//         </>
//     );
// }

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // You may need to install this package
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Register({ setOpenModal, loadUserData }) {
    const [userInfo, setUserInfo] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        role: "user",
        birthday: "",
        gender: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const history = useHistory();
    const { setAuth } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!userInfo.firstname.trim()) {
            newErrors.firstname = "First name is required";
        } else if (userInfo.firstname.length < 2) {
            newErrors.firstname = "First name must be at least 2 characters";
        }

        if (!userInfo.lastname.trim()) {
            newErrors.lastname = "Last name is required";
        } else if (userInfo.lastname.length < 2) {
            newErrors.lastname = "Last name must be at least 2 characters";
        }

        if (!userInfo.username.trim()) {
            newErrors.username = "Username is required";
        } else if (userInfo.username.length < 4) {
            newErrors.username = "Username must be at least 4 characters";
        }

        if (!userInfo.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(userInfo.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!userInfo.password) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(userInfo.password)) {
            newErrors.password = "Password must include uppercase, lowercase, number, and symbol";
        }

        if (!userInfo.birthday) {
            newErrors.birthday = "Date of birth is required";
        } else {
            const selectedDate = new Date(userInfo.birthday);
            const today = new Date();
    
            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
        
            if (selectedDate >= today) {
                newErrors.birthday = "Birthday must be before today";
            }
        }

        if (!userInfo.gender) {
            newErrors.gender = "Gender is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const registerUser = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validateForm()) return;

        // try {
        //     const res = await axios.post(`${BASE_URL}auth/register`, userInfo, {
        //         withCredentials: true,
        //     });

        //     if (res.data.message === "Registration successful") {
        //         sessionStorage.setItem("user", JSON.stringify(res.data.user));
        //         setAuth(true);
        //         Swal.fire({
        //             title: "Success",
        //             text: "Registration successful",
        //             icon: "success",
        //             background: "#f8fafc",
        //             confirmButtonColor: "#3b82f6"
        //         });
        //         setOpenModal(false);
        //         loadUserData();
        //     }
        // } catch (error) {
        //     console.error("Registration error:", error);
        //     Swal.fire({
        //         title: "Error",
        //         text: error.response?.data?.message || "Registration failed. Please try again.",
        //         icon: "error",
        //         background: "#f8fafc",
        //         confirmButtonColor: "#3b82f6"
        //     });
        //     setServerError(
        //         error.response?.data?.message ||
        //         "Registration failed. Please try again."
        //     );
        // }

        try {
            const api = createAxiosInstance();
            const res = await api.post(`user`, userInfo);

            if (res.status === 200) {
                // sessionStorage.setItem("user", JSON.stringify(res.data.user));
                // setAuth(true);
                Swal.fire({
                    title: "Success",
                    text: "User Added successfully",
                    icon: "success",
                    background: "#f8fafc",
                    confirmButtonColor: "#3b82f6"
                });
                setOpenModal(false);
                loadUserData();
            }
        } catch (error) {
            // console.error("Registration error:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Registration failed. Please try again.",
                icon: "error",
                background: "#f8fafc",
                confirmButtonColor: "#3b82f6"
            });
            setServerError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        }

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
                                Create New Account
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
                            <form onSubmit={registerUser}>
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
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter First Name"
                                                name="firstname"
                                                value={userInfo.firstname}
                                                onChange={handleChange}
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
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Last Name"
                                                name="lastname"
                                                value={userInfo.lastname}
                                                onChange={handleChange}
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
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                name="birthday"
                                                value={userInfo.birthday}
                                                onChange={handleChange}
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
                                                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                    onChange={handleChange}
                                                    value={userInfo.gender}
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
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Username"
                                                name="username"
                                                value={userInfo.username}
                                                onChange={handleChange}
                                                autoComplete="username"
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
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Enter Email Address"
                                                name="email"
                                                value={userInfo.email}
                                                onChange={handleChange}
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
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                placeholder="Create Password"
                                                name="password"
                                                value={userInfo.password}
                                                onChange={handleChange}
                                                autoComplete="new-password"
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
                                                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                    onChange={handleChange}
                                                    value={userInfo.role}
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

                                {/* Password Requirements */}
                                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                                    <h5 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Password Requirements
                                    </h5>
                                    <ul className="text-xs text-blue-700 ml-5 list-disc">
                                        <li>Minimum 8 characters</li>
                                        <li>At least one uppercase letter</li>
                                        <li>At least one lowercase letter</li>
                                        <li>At least one number</li>
                                        <li>At least one special character</li>
                                    </ul>
                                </div>

                                {/* Server Error Message */}
                                {serverError && (
                                    <div className="mb-6 bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-red-700">{serverError}</p>
                                    </div>
                                )}
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
                                onClick={registerUser}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Register
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}