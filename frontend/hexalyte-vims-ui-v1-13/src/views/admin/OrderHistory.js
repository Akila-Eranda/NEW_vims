import React, { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, Truck, CheckCircle, Clock, XCircle, User, Search, RefreshCw, AlertCircle, Filter, TrendingUp, Star, ClockFading } from 'lucide-react';
import { createAxiosInstance } from 'api/axiosInstance';

function CustomerOrderHistory() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [locations, setLocations] = useState([])

    useEffect(() => {
        loadCustomers();
        loadLocations();
    }, []);

    const loadLocations = async () => {
        try {

            const api = createAxiosInstance()
            const response = await api.get('location')

            if (response.status === 200) {
                setLocations(() => response.data.locations)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const loadCustomers = async () => {
        setLoadingCustomers(true);
        setError(null);
        try {
            // Uncomment when using real API
            // const response = await fetch('/v1/customer');

            const api = createAxiosInstance()
            const response = await api.get('customer')

            const data = await response.data;
            setCustomers(data.allCustomers || []);

            // Mock data using your API structure
            // await new Promise(resolve => setTimeout(resolve, 500));
            // const mockData = {
            //     "allCustomers": [
            //         {
            //             "CustomerID": 3,
            //             "CustomerAddressID": 3,
            //             "Name": "Avindu Vidusanka",
            //             "CompanyName": "AVINDU T",
            //             "Phone": "0774194056",
            //             "Email": "avindu2019@gmail.com",
            //             "Note": "TEST Note T",
            //             "isActive": true,
            //             "createdAt": "2025-06-14T13:30:13.000Z",
            //             "updatedAt": "2025-06-14T13:39:43.000Z"
            //         },
            //         {
            //             "CustomerID": 4,
            //             "CustomerAddressID": 4,
            //             "Name": "Sarah Johnson",
            //             "CompanyName": "TechStart Inc",
            //             "Phone": "0771234567",
            //             "Email": "sarah.j@techstart.com",
            //             "Note": "Premium customer",
            //             "isActive": true,
            //             "createdAt": "2025-06-10T10:15:20.000Z",
            //             "updatedAt": "2025-06-12T15:30:10.000Z"
            //         },
            //         {
            //             "CustomerID": 5,
            //             "CustomerAddressID": 5,
            //             "Name": "Michael Brown",
            //             "CompanyName": "RetailPlus",
            //             "Phone": "0779876543",
            //             "Email": "m.brown@retailplus.com",
            //             "Note": "Bulk order customer",
            //             "isActive": true,
            //             "createdAt": "2025-06-05T08:45:15.000Z",
            //             "updatedAt": "2025-06-14T12:20:30.000Z"
            //         }
            //     ]
            // };
            // setCustomers(mockData.allCustomers);
        } catch (err) {
            setError('Failed to load customers');
            console.error('Error loading customers:', err);
        } finally {
            setLoadingCustomers(false);
        }
    };

    const loadCustomerOrders = async (customerId) => {
        setLoading(true);
        setError(null);
        try {
            // Uncomment when using real API
            //   const response = await fetch(`/v1/sales-orders?customerId=${customerId}`);
            const api = createAxiosInstance()
            const response = await api.get(`salesorder`)
            const data = await response.data.salesorders.filter(order => order.CustomerID === customerId);
            setOrders(data);

            // Mock data using your API structure
            //   await new Promise(resolve => setTimeout(resolve, 600));
            //   const mockOrders = {
            //     3: {
            //       "status": "success",
            //       "message": "Sales orders retrieved successfully",
            //       "salesorders": [
            //         {
            //           "OrderID": 1,
            //           "CustomerID": 3,
            //           "OrderDate": "2025-06-14T14:27:15.000Z",
            //           "TotalAmount": "150",
            //           "Status": "STORE PICKUP",
            //           "Discount": "0",
            //           "PaymentStatus": "PAID",
            //           "DiscountID": null,
            //           "createdAt": "2025-06-14T14:27:25.000Z",
            //           "updatedAt": "2025-06-14T19:07:53.000Z",
            //           "LocationID": 1
            //         },
            //         {
            //           "OrderID": 2,
            //           "CustomerID": 3,
            //           "OrderDate": "2025-06-14T19:11:56.000Z",
            //           "TotalAmount": "450",
            //           "Status": "SUBMITTED",
            //           "Discount": "0",
            //           "PaymentStatus": "PAID",
            //           "DiscountID": null,
            //           "createdAt": "2025-06-14T19:12:07.000Z",
            //           "updatedAt": "2025-06-14T19:12:22.000Z",
            //           "LocationID": 1
            //         }
            //       ]
            //     },
            //     4: {
            //       "status": "success",
            //       "salesorders": [
            //         {
            //           "OrderID": 3,
            //           "CustomerID": 4,
            //           "OrderDate": "2025-06-12T10:30:00.000Z",
            //           "TotalAmount": "750",
            //           "Status": "DELIVERED",
            //           "Discount": "50",
            //           "PaymentStatus": "PAID",
            //           "DiscountID": 1,
            //           "createdAt": "2025-06-12T10:30:15.000Z",
            //           "updatedAt": "2025-06-13T16:45:00.000Z",
            //           "LocationID": 1
            //         }
            //       ]
            //     }
            //   };

            // const customerOrders = mockOrders[customerId];
            // setOrders(customerOrders ? customerOrders.salesorders : []);
        } catch (err) {
            setError('Failed to load orders');
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        loadCustomerOrders(customer.CustomerID);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredOrders = orders.filter(order =>
        filterStatus === 'all' || order.Status.toLowerCase().includes(filterStatus.toLowerCase())
    );

    const getStatusIcon = (status) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('delivered') || lowerStatus.includes('pickup')) {
            return <CheckCircle className="w-4 h-4 text-emerald-600" />;
        } else if (lowerStatus.includes('shipped') || lowerStatus.includes('transit')) {
            return <Truck className="w-4 h-4 text-blue-600" />;
        } else if (lowerStatus.includes('submitted') || lowerStatus.includes('processing')) {
            return <Clock className="w-4 h-4 text-amber-600" />;
        } else if (lowerStatus.includes('cancelled')) {
            return <XCircle className="w-4 h-4 text-red-600" />;
        } else {
            return <Package className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusStyle = (status) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('delivered') || lowerStatus.includes('pickup')) {
            return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        } else if (lowerStatus.includes('shipped') || lowerStatus.includes('transit')) {
            return 'bg-blue-50 text-blue-700 border border-blue-200';
        } else if (lowerStatus.includes('submitted') || lowerStatus.includes('processing')) {
            return 'bg-amber-50 text-amber-700 border border-amber-200';
        } else if (lowerStatus.includes('cancelled')) {
            return 'bg-red-50 text-red-700 border border-red-200';
        } else {
            return 'bg-gray-50 text-gray-700 border border-gray-200';
        }
    };

    const getPaymentStatusStyle = (paymentStatus) => {
        if (paymentStatus === 'PAID') {
            return 'bg-green-100 text-green-700';
        } else if (paymentStatus === 'PENDING') {
            return 'bg-yellow-100 text-yellow-700';
        } else {
            return 'bg-red-100 text-red-700';
        }
    };

    const getCustomerInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR'
        }).format(parseFloat(amount));
    };

    return (
        <div className="min-h-screen  p-4">
            {/* Header */}
            <div className="mb-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Customer Order
                    </h1>
                    <p className="text-gray-600 text-sm">Manage customer relationships and track order performance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Customer Selection Panel */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 h-fit sticky top-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                Customers
                            </h2>
                            <button
                                onClick={loadCustomers}
                                disabled={loadingCustomers}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 text-gray-700 ${loadingCustomers ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Search Box */}
                        <div className="relative mb-4">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
                            />
                        </div>

                        {/* Customer List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                            {loadingCustomers ? (
                                <div className="text-center py-6">
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-600 text-sm">Loading customers...</p>
                                </div>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <div
                                        key={customer.CustomerID}
                                        onClick={() => handleCustomerSelect(customer)}
                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedCustomer?.CustomerID === customer.CustomerID
                                            ? 'bg-blue-50 border-2 border-blue-300'
                                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-xs">
                                                {getCustomerInitials(customer.Name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 text-sm truncate">{customer.Name}</div>
                                                <div className="text-xs text-gray-600 truncate">{customer.CompanyName}</div>
                                                <div className="text-xs text-gray-500 truncate">{customer.Email}</div>
                                                <div className="text-xs text-gray-500 mt-1">{customer.Phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Orders Panel */}
                <div className="xl:col-span-3">
                    {selectedCustomer ? (
                        <div className="space-y-4">
                            {/* Customer Header */}
                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                            {getCustomerInitials(selectedCustomer.Name)}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.Name}</h2>
                                            <div className="text-gray-600 text-sm">{selectedCustomer.CompanyName}</div>
                                            <div className="text-gray-500 text-xs">{selectedCustomer.Email}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${selectedCustomer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                        <div className="text-gray-600 text-xs mt-1">Phone: {selectedCustomer.Phone}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Filter Bar */}
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <Filter className="w-4 h-4 text-gray-600" />
                                    <div className="flex space-x-2">
                                        {['all', 'submitted', 'store pickup', 'delivered', 'cancelled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${filterStatus === status
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                                        <span className="text-red-700 text-sm">{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Orders List */}
                            {loading ? (
                                <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-3" />
                                    <p className="text-gray-600 text-sm">Loading orders...</p>
                                </div>
                            ) : filteredOrders.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredOrders.map((order) => (
                                        <div key={order.OrderID} className="bg-white rounded-lg p-4 border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-gray-700" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-sm">Order #{order.OrderID}</h3>
                                                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{formatDate(order.OrderDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end space-x-2 mb-1">
                                                        {getStatusIcon(order.Status)}
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(order.Status)}`}>
                                                           {order.Status}
                                                        </span>
                                                    </div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {formatCurrency(order.TotalAmount)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                                <div>
                                                    <span className="text-gray-500">Payment Status: &nbsp; </span>
                                                    <div className={`inline-block px-2 py-1 rounded mt-1 font-medium ${getPaymentStatusStyle(order.PaymentStatus)}`}>
                                                        {order.PaymentStatus}
                                                    </div>
                                                </div>
                                                {/* <div>
                                                    <span className="text-gray-500">Discount:</span>
                                                    <div className="text-gray-900 font-medium mt-1">{formatCurrency(order.Discount)}</div>
                                                </div> */}
                                                <div>
                                                    <span className="text-gray-500">Location:</span>
                                                    <div className="text-gray-900 font-medium mt-1">{ locations.find(location => order.LocationID === location.LocationID).WarehouseName }</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Updated:</span>
                                                    <div className="text-gray-900 font-medium mt-1">{formatDate(order.updatedAt)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                                    <p className="text-gray-600 text-sm">This customer hasn't placed any orders yet.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
                            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Customer</h3>
                            <p className="text-gray-600 text-sm">Choose a customer to view their complete order history and details.</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(229, 231, 235, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
        </div>
    );
}

export default CustomerOrderHistory;