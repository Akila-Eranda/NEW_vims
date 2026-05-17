// import React, { useState } from 'react';
// import { Loader2 } from 'lucide-react';
// import { Link, useParams } from 'react-router-dom/cjs/react-router-dom';
// import { createAxiosInstance } from 'api/axiosInstance';
// import axios from 'axios';

// const Onboard = () => {

//     const BASE_URL = process.env.REACT_APP_BASE_URL;

//     const [isLoading, setIsLoading] = useState(false);
//     const [isRegistered, setIsRegistered] = useState(false);

//     const params = useParams()

//     // const decodedUser = atob(params.userData)
//     // console.log(params.userData)

//     const handleProceedRegistration = async () => {
//         setIsLoading(true);

//         // Empty function - placeholder for registration logic
//         const processRegistration = async () => {
//             // Simulate registration process
//             //   await new Promise(resolve => setTimeout(resolve, 3000));
//             //   return { success: true };

//             const response = await axios.get(`${BASE_URL}onboard/getStarted/${params.userData}`)
//             if (response.status === 200) {
//                 return "success"
//             } else if (response.status === 409) {
//                 throw new Error('User already exists')
//             } else {
//                 throw new Error('Unknown error occurred')
//             }

//         };

//         try {
//             await processRegistration();
//             setIsRegistered(true);
//         } catch (error) {
//             console.error('Registration failed:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 h-full">
//             <div className="flex content-center items-center justify-center h-full">
//                 <div className="w-full lg:w-6/12 px-4">
//                     <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
//                         <div className="rounded-t mb-0 px-6 py-6">
//                             <div className="text-center mb-3">
//                                 <h6 className="text-blueGray-500 text-sm font-bold">
//                                     Welcome to Hexa VIMS
//                                 </h6>
//                             </div>
//                         </div>

//                         <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
//                             <div className="text-center">

//                                 {/* Loading State */}
//                                 {isLoading && (
//                                     <div className="mb-6">
//                                         <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blueGray-600" />
//                                         <h2 className="text-xl font-semibold mb-2 text-blueGray-700">
//                                             Processing Registration...
//                                         </h2>
//                                         <p className="text-blueGray-500">
//                                             Please wait while we set up your account
//                                         </p>
//                                     </div>
//                                 )}

//                                 {/* Registration Complete State */}
//                                 {!isLoading && isRegistered && (
//                                     <div className="mb-6">
//                                         <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
//                                             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                             </svg>
//                                         </div>
//                                         <h2 className="text-2xl font-bold mb-4 text-blueGray-700">
//                                             Registration Complete!
//                                         </h2>
//                                         <p className="text-blueGray-500 mb-8">
//                                             Your account has been successfully created.
//                                         </p>
//                                         <Link
//                                             to="/auth/login"
//                                             className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
//                                         >
//                                             Go to Login
//                                         </Link>
//                                     </div>
//                                 )}

//                                 {/* Initial State */}
//                                 {!isLoading && !isRegistered && (
//                                     <div className="mb-6">
//                                         <h1 className="text-2xl font-bold mb-4 text-blueGray-700">
//                                             Complete Your Setup
//                                         </h1>
//                                         <p className="text-blueGray-500 mb-8">
//                                             Click below to complete your registration and access your dashboard
//                                         </p>
//                                         <button
//                                             onClick={handleProceedRegistration}
//                                             className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
//                                         >
//                                             Proceed with Registration
//                                         </button>
//                                     </div>
//                                 )}

//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Onboard;


import React, { useState } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom';
import { createAxiosInstance } from 'api/axiosInstance';
import axios from 'axios';

const Onboard = () => {
    const BASE_URL = "https://api.vims.hexalyte.com/v1/";

    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const params = useParams();

    // Validate environment and params
    const validateRequirements = () => {
        if (!BASE_URL) {
            throw new Error('BASE_URL is not configured. Please check your environment variables.');
        }
        
        if (!params?.userData) {
            throw new Error('User data parameter is missing from the URL.');
        }

        // Validate userData format if needed (e.g., check if it's valid base64)
        try {
            // Uncomment if you need to validate base64 format
            // atob(params.userData);
        } catch (e) {
            throw new Error('Invalid user data format in URL parameter.');
        }
    };

    const processRegistration = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}onboard/getStarted/${params.userData}`,
                {
                    timeout: 30000, // 30 second timeout
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status === 200) {
                return { success: true, data: response.data };
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }

        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const message = error.response.data?.message || error.response.statusText;
                
                switch (status) {
                    case 409:
                        throw new Error('This account has already been registered. Please try logging in instead.');
                    case 400:
                        throw new Error('Invalid registration data. Please check your invitation link.');
                    case 404:
                        throw new Error('Registration endpoint not found. Please contact support.');
                    case 500:
                        throw new Error('Server error occurred. Please try again later.');
                    default:
                        throw new Error(`Registration failed: ${message} (Status: ${status})`);
                }
            } else if (error.request) {
                // Network error - no response received
                if (error.code === 'ECONNABORTED') {
                    throw new Error('Registration request timed out. Please check your internet connection and try again.');
                } else if (error.code === 'ERR_NETWORK') {
                    throw new Error('Network error. Please check your internet connection.');
                } else {
                    throw new Error('Unable to connect to the server. Please try again later.');
                }
            } else {
                // Other errors
                throw new Error(`Registration failed: ${error.message}`);
            }
        }
    };

    const handleProceedRegistration = async () => {
        try {
            // Clear any previous errors
            setError(null);
            setIsLoading(true);

            // Validate requirements before proceeding
            validateRequirements();

            // Process registration
            await processRegistration();
            
            setIsRegistered(true);
            setRetryCount(0); // Reset retry count on success

        } catch (error) {
            console.error('Registration failed:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        handleProceedRegistration();
    };

    // Error boundary fallback
    if (!BASE_URL) {
        return (
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-6/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-red-100 border-0">
                            <div className="flex-auto px-4 lg:px-10 py-10">
                                <div className="text-center">
                                    <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-600" />
                                    <h2 className="text-xl font-semibold mb-2 text-red-700">
                                        Configuration Error
                                    </h2>
                                    <p className="text-red-600">
                                        Application is not properly configured. Please contact support.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-sm font-bold">
                                    Welcome to Hexa VIMS
                                </h6>
                            </div>
                        </div>

                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <div className="text-center">

                                {/* Loading State */}
                                {isLoading && (
                                    <div className="mb-6">
                                        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blueGray-600" />
                                        <h2 className="text-xl font-semibold mb-2 text-blueGray-700">
                                            Processing Registration...
                                        </h2>
                                        <p className="text-blueGray-500">
                                            Please wait while we set up your account
                                        </p>
                                        {retryCount > 0 && (
                                            <p className="text-blueGray-400 text-sm mt-2">
                                                Retry attempt {retryCount}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Error State */}
                                {!isLoading && error && (
                                    <div className="mb-6">
                                        <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-600" />
                                        <h2 className="text-xl font-semibold mb-2 text-red-700">
                                            Registration Failed
                                        </h2>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                            <p className="text-red-700 text-sm">
                                                {error}
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleRetry}
                                                className="bg-red-600 text-white active:bg-red-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 flex items-center justify-center"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Try Again
                                            </button>
                                            {error.includes('already been registered') && (
                                                <Link
                                                    to="/auth/login"
                                                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 inline-block"
                                                >
                                                    Go to Login
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Registration Complete State */}
                                {!isLoading && !error && isRegistered && (
                                    <div className="mb-6">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4 text-blueGray-700">
                                            Registration Complete!
                                        </h2>
                                        <p className="text-blueGray-500 mb-8">
                                            Your account has been successfully created.
                                        </p>
                                        <Link
                                            to="/auth/login"
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                        >
                                            Go to Login
                                        </Link>
                                    </div>
                                )}

                                {/* Initial State */}
                                {!isLoading && !error && !isRegistered && (
                                    <div className="mb-6">
                                        <h1 className="text-2xl font-bold mb-4 text-blueGray-700">
                                            Complete Your Setup
                                        </h1>
                                        <p className="text-blueGray-500 mb-8">
                                            Click below to complete your registration and access your dashboard
                                        </p>
                                        <button
                                            onClick={handleProceedRegistration}
                                            disabled={isLoading}
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Proceed with Registration
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboard;