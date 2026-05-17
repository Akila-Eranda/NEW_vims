import React, { useState } from "react";
import axios from "axios";


function InventoryEditModal({ setOpenModal, inventoryInfo, editInventory }) {
    const [errors, setErrors] = useState({});
    const [inventoryData, setInventoryData] = useState({
        ProductID: inventoryInfo.ProductID,
        LocationID: inventoryInfo.LocationID,
        Quantity: inventoryInfo.Quantity,
    });

    const handleChange = (e) => {
        setInventoryData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!inventoryData.Quantity || inventoryData.Quantity <= 0) {
            validationErrors.Quantity = "Quantity must be a positive number";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            editInventory(inventoryData);
            setOpenModal(false);
        }
    };

    // const addressData = axios.get(`http://localhost:4444/v1/location/${inventoryInfo.LocationID}`);

    // console.log(addressData);
    // console.log(addressData.data)

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 pt-80 md:pt-0 z-50 outline-none focus:outline-none">
                <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-3xl text-center font-semibold">
                                Edit Inventory
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setOpenModal(false)}
                            >
                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        <div className="relative p-6">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="ProductID" className="font-bold block my-2">
                                        Product ID
                                    </label>
                                    <input
                                        type="text"
                                        name="ProductID"
                                        value={inventoryData.ProductID}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
                                        placeholder="Product ID"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label htmlFor="LocationID" className="font-bold block my-2">
                                        Location ID
                                    </label>
                                    <input
                                        type="text"
                                        name="LocationID"
                                        value={inventoryData.LocationID}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
                                        placeholder="Location ID"
                                        readOnly
                                    />
                                </div>

                                {/* <div>
                                    <label htmlFor="LocationID" className="font-bold block my-2">
                                        Location ID
                                    </label>
                                    <input
                                        type="text"
                                        name="LocationID"
                                        value={addressData.WarehouseName}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
                                        placeholder="Location ID"
                                        readOnly
                                    />
                                </div> */}
                                
                                <div>
                                    <label htmlFor="Quantity" className="font-bold block my-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="Quantity"
                                        value={inventoryData.Quantity}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
                                        placeholder="Enter quantity"
                                    />
                                    {errors.Quantity && (
                                        <div className="text-red-500 text-sm mt-1">{errors.Quantity}</div>
                                    )}
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="submit"
                                    >
                                        Update Inventory
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}

export default InventoryEditModal;