const db = require('../models');
const Location = db.warehouselocation;

const createlocation = async (params) => {
    const { WarehouseName, Address } = params;
    const location = {  WarehouseName, Address };

    const [row, created] = await Location.findOrCreate({
        where: { WarehouseName:WarehouseName},
        defaults: location,
    });

    if (created) {
        return row;
    }
    return null;
};

const getalllocation = async () => {
    const locations = await Location.findAll();
    return locations;
};

const getlocationBYId = async (LocationID) => {
    const location = await Location.findOne({ where: { LocationID} });
    return location;
};

const updateUserById = async (LocationID, updateBody) => {
    const {WarehouseName, Address } =updateBody;
    const location = {
        WarehouseName, Address 
    }
    const row = await Location.update(location, {
        where: {LocationID:LocationID},
    });
    return row;
};


const deletelocationById = async (LocationID) => {
    const location = await getlocationBYId(LocationID);
    if (!location) return null
    await location.destroy();
    return location;
    

    
};
module.exports = {
    createlocation,
    getalllocation,
    getlocationBYId,
    deletelocationById,
    updateUserById
};