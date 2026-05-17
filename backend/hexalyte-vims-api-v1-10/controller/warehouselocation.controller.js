const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const Locationservices = require("../service/warehouselocation.service.js");

const createlocation = catchAsync(async (req, res) => {
    const location = await Locationservices.createlocation(req.body);

    if (location) {
        res.status(httpStatus.CREATED).send({
            status: "success",
            message: "Location created successfully",
            location
        });
    } else {
        res.status(httpStatus.CONFLICT).send({
            status: "failure",
            message: "Location already exists",
        });
    }
});

const getalllocation = catchAsync(async (req, res) => {
    const locations = await Locationservices.getalllocation();
    if(locations.length==0){
        res.status(httpStatus.NOT_FOUND).send({
                    status:"failure",
                    message:"no location found"
                })
    }
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Locations retrieved successfully",
        locations
    });
});

const getlocationbyID = catchAsync(async (req, res) => {
    const location = await Locationservices.getlocationBYId(req.params.id);
    if (location) {
        res.status(httpStatus.OK).send({
            status: "success",
            message: "Location retrieved successfully",
            location
        });
    } else {
        res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Location not found",
        });
    }
});

const updatelocation = catchAsync(async (req, res) => {
    const row = await Locationservices.updateUserById(req.params.id, req.body);
    if (!row) {
        res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Location not found",
        });
        return;
    }

    const updatedLocation = await Locationservices.getlocationBYId(req.params.id);
    res.status(httpStatus.OK).send({
        status: "success",
        message: "Location updated successfully",
        location: updatedLocation
    });
});

const deletelocation = catchAsync(async (req, res) => {
    const deleted = await Locationservices.deletelocationById(req.params.id);
    if (!deleted) {
        res.status(httpStatus.NOT_FOUND).send({
            status: "failure",
            message: "Location not found",
        });
        return;
    }
    res.status(httpStatus.NO_CONTENT).send({
        status: "success",
        message: "Location deleted successfully"
    });
});

module.exports = {
    createlocation,
    getalllocation,
    getlocationbyID,
    updatelocation,
    deletelocation
};
