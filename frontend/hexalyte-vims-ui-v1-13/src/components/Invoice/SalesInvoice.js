import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

const A4PrintInvoice = React.forwardRef(({ order, orderItems }, ref) => {
    const [products, setProducts] = useState([]);

    // Find product name with error handling
    const getProductName = (productId) => {
        if (!products || products.length === 0) return 'Loading...';
        const product = products.find(
            (product) => product.ProductID.toString() === productId.toString()
        );
        return product ? product.Name : 'Unknown Product';
    };

    async function fetchProducts(){
        try {
            const productsRes = await axios.get(`${BASE_URL}product`, {withCredentials: true})
            if(productsRes.status === 200){
                setProducts(() => productsRes.data.allProducts.filter(product => product.isActive !== false))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div
            // ref={ref}
            className="bg-white mx-auto text-gray-800"
            style={{
                width: '210mm',
                height: '297mm',
                padding: '20mm',
                margin: '0 auto',
                boxSizing: 'border-box',
                pageBreakAfter: 'always'
            }}
        >
            {/* Main Content Container */}
            <div>
                {/* Header Section - Side by Side */}
                <div className="flex flex-row justify-between mb-10">
                    {/* Billed To - Left side */}
                    <div className="w-1/2 pr-4">
                        <div className="flex items-center mb-3">
                            <div className="mr-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 10H21M7 15H8M12 15H13M6 5H18C19.6569 5 21 6.34315 21 8V16C21 17.6569 19.6569 19 18 19H6C4.34315 19 3 17.6569 3 16V8C3 6.34315 4.34315 5 6 5Z"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-medium">Billed To</h2>
                        </div>

                        <div className="ml-7">
                            <p className="font-medium">Company Name</p>
                            <p>123 Business Avenue</p>
                            <p>Kandy, Central Province</p>
                            <p>contact@company.com</p>
                        </div>
                    </div>

                    {/* Invoice Details - Right side */}
                    <div className="w-1/2 pl-4">
                        <div className="flex items-center mb-3">
                            <div className="mr-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-medium">Invoice Details</h2>
                        </div>

                        <div className="ml-7 space-y-1">
                            <p>Issue Date: May 1, 2025</p>
                            <p>Status: <span className="uppercase font-medium">TO DELIVER</span></p>
                            {/* <p>Invoice No: {order.OrderID} </p> */}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="my-10 mt-8">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-3 text-left">Item</th>
                                <th className="py-3 text-center">Quantity</th>
                                <th className="py-3 text-right">Unit Price</th>
                                <th className="py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                // orderItems.map((item, index) => (
                                //     <tr key={index} className="border-b border-gray-200">
                                //         <td className="py-3 text-left">
                                //             <div className="font-medium"> { getProductName(item.ProductId) } </div>
                                //             <div className="text-sm text-gray-500"> {item.ProductId} </div>
                                //         </td>
                                //         <td className="py-3 text-center"> {item.Quantity} </td>
                                //         <td className="py-3 text-right"> {item.UnitPrice} LKR </td>
                                //         <td className="py-3 text-right"> {Number(item.Quantity) * Number(item.UnitPrice)} LKR </td>
                                //     </tr>
                                // ))
                            }
                            {/* <tr className="border-b border-gray-200">
                <td className="py-3 text-left">
                  <div className="font-medium">Premium Widget</div>
                  <div className="text-sm text-gray-500">Product ID: 1</div>
                </td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">LKR 180</td>
                <td className="py-3 text-right">LKR 180</td>
              </tr> */}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="flex justify-end mb-10">
                    <div className="w-1/2">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                {/* <span>{ Number(order.TotalAmount) + Number(order.Discount) }</span> */}
                            </div>

                            <div className="flex justify-between">
                                <span>Discount</span>
                                {/* <span>{ order.Discount }</span> */}
                            </div>

                            <div className="flex justify-between">
                                <span>Tax </span>
                                <span>LKR 0.00</span>
                            </div>

                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                                <span className="font-bold text-lg">Total</span>
                                {/* <span className="font-bold text-lg">{order.TotalAmount} LKR</span> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Instructions */}
                <div className="mb-12">
                    <h3 className="text-lg font-medium mb-2">Payment Instructions</h3>
                    <p>Please make payment within 30 days to the bank account provided in the email.</p>
                </div>

                {/* Footer with horizontal line */}
                <div className="border-t border-gray-200 pt-6 mt-20 text-center text-gray-500">
                    <p>Thank you for your business!</p>
                    <p className="mt-1">If you have any questions, please contact support@company.com</p>
                </div>


            </div>
        </div>
    );
});

export default A4PrintInvoice;