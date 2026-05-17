const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const Supplierservices = require("../service/supplier.service");

const createsupplier = catchAsync(async (req, res) => {
    const supplier = await Supplierservices.createsupplier(req.body);

    if (supplier) {
        res.status(httpStatus.CREATED).send({
            status: "success",
            message: "Supplier created successfully",
            supplier
        });
    } else {
        res.status(httpStatus.CONFLICT).send({
            status: "failure",
            message: "Supplier already exists",
        });
    }
});

const getallsupplier = catchAsync(async (req, res) => {
    const suppliers =  await Supplierservices.getallsupplier();
    if(suppliers.length==0){
        res.status(httpStatus.NOT_FOUND).send({
                    status:"failure",
                    message:"no supplier found"
                })
    }
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Suppliers retrieved successfully",
        suppliers
    });
});

const getsupplierbyID = catchAsync(async (req, res) => {
    const supplier = await Supplierservices.getsupplierBYId(req.params.id);
    if (supplier) {
        res.status(httpStatus.OK).send({
            status: "success",
            message: "Supplier retrieved successfully",
            supplier
        });
    } else {
        res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Supplier not found",
        });
    }
});

const updatesupplier = catchAsync(async (req, res) => {
    const row = await Supplierservices.updatesupplierById(req.params.id, req.body);
    if (!row) {
        res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Supplier not found",
        });
        return;
    }

    const updatedSupplier = await Supplierservices.getsupplierBYId(req.params.id);
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Supplier updated successfully",
        supplier: updatedSupplier
    });
});

const deletesupplier = catchAsync(async (req, res) => {
    const deleted = await Supplierservices.deletesupplierById(req.params.id);
    if (!deleted) {
        return res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Supplier not found",
        });
       
    }
    return res.status(httpStatus.OK).send({
        status: "success",
        message: "Supplier deleted successfully"
    });
});

module.exports = {
    createsupplier,
    getallsupplier,
    updatesupplier,
    getsupplierbyID,
    deletesupplier
};
