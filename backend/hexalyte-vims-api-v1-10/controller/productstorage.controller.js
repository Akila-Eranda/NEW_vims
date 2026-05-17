const productstorageServices = require('../service/productstorage.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const addNewProductStorage = catchAsync(async (req, res) => {
    const newProductStorage = await productstorageServices.addNewProductStorage(req.body)
    res.status(httpStatus.OK).send({ newProductStorage })
})

const getAllProductStorages = catchAsync(async (req, res) => {
    const allProductStorages = await productstorageServices.getAllProductStorages()
    if (allProductStorages.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: 'No Product storages found'
        })
    }
    return res.status(httpStatus.OK).send(allProductStorages)
})

const getProductStorageByProductID = catchAsync(async (req, res) => {
    const productStorageByProductID = await productstorageServices.getProductStorageByProductID(req.params.id)
    if (productStorageByProductID.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: 'No Product storage found'
        })
    }
    return res.status(httpStatus.OK).send({ productStorageByProductID })
})


const getProductStorageByID = catchAsync(async (req, res) => {
    const { productId, locationId } = req.params;

    const productStorage = await productstorageServices.getProductStorageByID(
        locationId,
        productId
    );

    return res.status(httpStatus.OK).send({ productStorage });
});

const updateProductStorageByProductID = catchAsync(async (req, res) => {
    const updatedProductStorage = await productstorageServices.updateProductStorageByProductID(req.params.id, req.body)
    return res.status(httpStatus.OK).send({ updatedProductStorage })
})


const updateProductStorage = catchAsync(async (req, res) => {
    const { productId, locationId } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: 'No product storage data provided'
        });
    }
    const result = await productstorageServices.updateProductStorage(
        productId,
        locationId,
        updateData
    );
    if (!result) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Product Storage Found",
        });
    }

    if (result === 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Product Storage Found",
        });
    }

    return res.status(httpStatus.OK).send({ result });

});

const updateProductQuantity = catchAsync(async (req, res) => {
    const { productId, locationId } = req.params;

    const updatedRow = await productstorageServices.updateProductQuantity(productId, locationId, req.body);
    // return res.send({updatedRow});

    if (updatedRow == null) {
        return res.status(httpStatus.NOT_FOUND).send({
            status: 'fail',
            message: "Values cannot be empty",
        })
    } else if (typeof updatedRow === "string") {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: updatedRow,
        })
    } else if (updatedRow[0] === 1) {
        return res.status(httpStatus.OK).send({
            status: 'success',
            message: 'Product Storage Updated successfully',
            updatedRow: updatedRow
        })
    }

})

const deleteProductStorage = catchAsync(async (req, res) => {
    const { productId, locationId } = req.params;

    const deletedProductStorage = await productstorageServices.deleteProductStorage(
        productId,
        locationId
    );

    return res.status(httpStatus.OK).send({ deletedProductStorage });

});

// const getstockreport = catchAsync(async (req,res) => {
//     const{locationId} = req.params;

//     const getStockReportcontrol=await productstorageServices.getStockReportFunc({
//         locationId:parseInt(locationId),
//     });
//     return res.status(httpStatus.OK).send(getStockReportcontrol);
// });
const getstockreport = catchAsync(async (req, res) => {
    const { locationId } = req.params;

    console.log(locationId)

    const getStockReportcontrol = await productstorageServices.getStockReportFunc(locationId);

    console.log(getStockReportcontrol)

      return res.status(httpStatus.OK).send(getStockReportcontrol);

    // return res.status(httpStatus.OK).send({ message: "Stock report controller works" })

});


module.exports = {
    getAllProductStorages,
    getProductStorageByProductID,
    addNewProductStorage,
    updateProductStorageByProductID,
    updateProductQuantity,
    deleteProductStorage,
    updateProductStorage,
    getProductStorageByID,
    getstockreport,
}