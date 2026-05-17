const db = require('../models')
const productServices = require("./product.service");
const Category = db.category;
const Supplier = db.supplier;
const Product = db.product;

const getProductByID = async (productID) => {

    const product = await Product.findByPk(productID)
    return product

}

const addProduct = async (params) => {

    const { Name, Description, BuyingPrice, SellingPrice, QuantityInStock, CategoryID, SupplierID } = params

    const category = await Category.findByPk(CategoryID)

    if (category == null) {
        return "no category found"
    }

    const supplier = await Supplier.findByPk(SupplierID)

    if (supplier == null) {
        return "no supplier found"
    }

    const newProduct = {
        Name,
        Description,
        BuyingPrice,
        SellingPrice,
        QuantityInStock,
        SupplierID,
        CategoryID,
        isActive: 1
    }

    const newProductRow = await Product.create(newProduct)

    return newProductRow

}

const updateProductById = async (productId, params) => {

    const { Name, Description, BuyingPrice, SellingPrice, QuantityInStock, CategoryID, SupplierID } = params

    const category = await Category.findByPk(CategoryID)

    if (category === null) {
        return "no category found"
    }

    const supplier = await Supplier.findByPk(SupplierID)

    if (supplier == null) {
        return "no supplier found"
    }

    const updatedProduct = {
        Name,
        Description,
        BuyingPrice,
        SellingPrice,
        QuantityInStock,
        CategoryID,
        SupplierID
    }
    console.log("CHECK ", updatedProduct);

    const productUpdateRow = await Product.update(updatedProduct, { where: { ProductID: productId } })


    return productUpdateRow

}

const updateProductQuantityById = async (productId, params) => {

    const { QuantityInStock, OrderType, TransactionType } = params

    const product = await Product.findByPk(productId)

    if (product == null) {
        return "no product found"
    }
    // console.log(QuantityInStock);
    const currentQuantity = Number(product.QuantityInStock)
    // console.log(currentQuantity)
    // if(TransactionType === "PurchaseOrder" && OrderType === "FULFILL"){
    //     const newQuantity = currentQuantity + QuantityInStock
    //     const updatedProduct = await Product.update({QuantityInStock: newQuantity}, { where: { productId } })
    //     return updatedProduct
    // } else if (TransactionType === "PurchaseOrder" && OrderType === "RETURN"){
    //     if (currentQuantity === 0) return "Quantity is zero"
    //     if (QuantityInStock > currentQuantity ) return `Only ${currentQuantity} is left in stock`
    //     const newQuantity = currentQuantity - QuantityInStock
    //     const updatedProduct = await Product.update({QuantityInStock: newQuantity}, {where: { productId } })
    //     return updatedProduct
    // } else if (TransactionType === "SalesOrder" && OrderType === "FULFILL") {
    //     if (currentQuantity === 0) return "Quantity is zero"
    //     if (QuantityInStock > currentQuantity ) return `Only ${currentQuantity} is left in stock`
    //     const newQuantity = currentQuantity - QuantityInStock
    //     const updatedProduct = await Product.update({QuantityInStock: newQuantity}, {where: { productId } })
    //     return updatedProduct
    // } else if (TransactionType === "SalesOrder" && OrderType === "RETURN"){
    //     const newQuantity = currentQuantity + QuantityInStock
    //     const updatedProduct = await Product.update({QuantityInStock: newQuantity}, { where: { productId } })
    //     return updatedProduct
    // }

    if (TransactionType === "FULFILL" && OrderType === "purchaseOrder") {
        const newQuantity = currentQuantity + Number(QuantityInStock)
        console.log("new qty"+newQuantity)
        const updatedProduct = await Product.update({ QuantityInStock: newQuantity }, { where: { ProductID: productId } })
        return updatedProduct
    } else if (TransactionType === "RETURN" && OrderType === "purchaseOrder") {
        if (currentQuantity === 0) return "Quantity is zero"
        if (QuantityInStock > currentQuantity) return `Only${currentQuantity} is left in stock`
        const newQuantity = currentQuantity - Number(QuantityInStock)
        const updatedProduct = await Product.update({ QuantityInStock: newQuantity }, { where: { ProductID: productId } })
        return updatedProduct
    } else if (TransactionType === "FULFILL" && OrderType === "salesOrder") {
        if (currentQuantity === 0) return "Quantity is zero"
        if (QuantityInStock > currentQuantity) return `Only ${currentQuantity} is left in stock`
        const newQuantity = currentQuantity - Number(QuantityInStock)
        const updatedProduct = await Product.update({ QuantityInStock: newQuantity }, { where: { ProductID: productId } })
        return updatedProduct
    } else if (TransactionType === "RETURN" && OrderType === "salesOrder") {
        const newQuantity = currentQuantity + Number(QuantityInStock)
        const updatedProduct = await Product.update({ QuantityInStock: newQuantity }, { where: { ProductID: productId } })
        return updatedProduct
    }


    // const product = await Product.update({ QuantityInStock }, { where: { ProductID: productId } })

    return product

}

const deleteProductById = async (productId) => {

    // const product = getProductByID(productId)

    return await Product.update({ isActive: 0 }, { where: { ProductID: productId } })
    // return Product.destroy({ where: { ProductID: productId } })

}

module.exports = {
    addProduct,
    updateProductById,
    updateProductQuantityById,
    getProductByID,
    deleteProductById
}