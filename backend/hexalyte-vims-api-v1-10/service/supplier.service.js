const db = require('../models');
const Supplier = db.supplier;

const createsupplier = async (params) => {
    const { Name, CompanyName, Phone, Email, Address } = params;
    const supplier = { Name, CompanyName, Phone, Email, Address, isActive: 1 };

    const [row, created] = await Supplier.findOrCreate({
        where: { Name: Name },
        defaults: supplier,
    });

    if (created) {
        return row;
    }
    return null;
};

const getallsupplier = async () => {
    const suppliers = await Supplier.findAll();
    return suppliers;
};

const getsupplierBYId = async (SupplierID) => {
    const supplier = await Supplier.findOne({ where: { SupplierID } });
    return supplier;
};

const updatesupplierById = async (SupplierID, updateBody) => {
    const { Name, CompanyName, Phone, Email, Address } = updateBody;
    const supplier = { Name, CompanyName, Phone, Email, Address };

    const [updatedRowCount] = await Supplier.update(supplier, {
        where: { SupplierID }
    });

    return updatedRowCount;
};

const deletesupplierById = async (SupplierID) => {
    const supplier = await getsupplierBYId(SupplierID);
    if (!supplier) return null;
    // await supplier.destroy();
    await Supplier.update({isActive: 0}, { where: { SupplierID: SupplierID } })
    return supplier;
};

module.exports = {
    createsupplier,
    getallsupplier,
    getsupplierBYId,
    deletesupplierById,
    updatesupplierById
};
