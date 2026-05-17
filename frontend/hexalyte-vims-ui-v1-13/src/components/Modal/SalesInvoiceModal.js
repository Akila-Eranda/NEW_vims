import { createAxiosInstance } from 'api/axiosInstance';
import SalesInvoiceIframe from 'components/Iframe/SalesInvoiceIframe';
import printReceipt from 'components/Invoice/PrintReceipt';
import SalesInvoice from 'components/Invoice/SalesInvoice';
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function SalesInvoiceModal({ orderInfo, setOpenSalesInvoiceModal }) {

    const [salesOrderItems, setSalesOrderItems] = useState([])
    

    const contentRef = useRef(null)
    const reactToPrintFn = useReactToPrint({ contentRef })

    async function fetchSalesOrderItems() {
        try {
            const api = createAxiosInstance();
            const salesOrderItemsRes = await api.get(`salesorderdetails/${orderInfo.OrderID}`)
            // console.log(salesOrderItemsRes)
            if (salesOrderItemsRes.status === 200) {
                setSalesOrderItems(() => salesOrderItemsRes.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSalesOrderItems()
    }, [])

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 pt-80 md:pt-0 z-50 outline-none focus:outline-none">
                <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            {/* <h3 className="text-3xl text-center font-semibold">
                                Sales Order Info
                            </h3> */}
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setOpenSalesInvoiceModal(null)}
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* <SalesInvoice ref={contentRef} order={orderInfo} orderItems={salesOrderItems} /> */}

                        <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
                            <button
                                className="text-teal-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                // onClick={() => reactToPrintFn()}
                                onClick={() => printReceipt()}
                            >
                                Print
                            </button>

                        </div>

                        <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setOpenSalesInvoiceModal(null)}

                            >
                                Close
                            </button>

                        </div>

                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default SalesInvoiceModal