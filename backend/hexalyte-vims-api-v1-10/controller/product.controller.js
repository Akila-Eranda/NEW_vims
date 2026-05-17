const db = require('../models')
const Product = db.product
const productServices = require('../service/product.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const getAllProducts = catchAsync(async (req, res) => {

    console.log(req.cookies)

    const allProducts = await Product.findAll({
        include: [{
            model: db.supplier,
            required: true
        }, {
            model: db.category,
            required: true
        }]
    })
    if (allProducts.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Products Found"
        })
    }

    return res.status(httpStatus.OK).send({ allProducts })
})

const getProductByID = catchAsync(async (req, res) => {
    const product = await productServices.getProductByID(req.params.id)
    if (!product) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `No Product Found with ID:${req.params.id}`
        })
    }

    return res.status(httpStatus.OK).send({ product })
})

const addProduct = catchAsync(async (req, res) => {
    const newProduct = await productServices.addProduct(req.body)
    if (newProduct == "no category found") {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Category ID. Category ID does not exists`
        })
    } else if (newProduct == "no supplier found") {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: "Invalid Supplier ID. Supplier ID does not exists"
        })
    }

    return res.status(httpStatus.OK).send({ newProduct })
})

const updateProductById = catchAsync(async (req, res) => {
    const updatedProduct = await productServices.updateProductById(req.params.id, req.body)
    if (updatedProduct == "no category found") {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Category ID. Category ID does not exists`
        })
    } else if (updatedProduct == "no supplier found") {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Category ID. Category ID does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ updatedProduct })
})

const updateProductQuantityById = catchAsync(async (req, res) => {
    const updatedProduct = await productServices.updateProductQuantityById(req.params.id, req.body)
    // console.log(updatedProduct);
    if(updatedProduct === "no product found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `Invalid Product ID. Product ID does not exists`
        })
    } else if (updatedProduct[0] === 1){
        return res.status(httpStatus.OK).send({
            message: `success`
        })
    } else if (typeof updatedProduct === "string") {
        return res.status(httpStatus.CONFLICT).send({
            message: updatedProduct
        })
    }

    return res.send(updatedProduct)
})

const deleteProductById = catchAsync(async (req, res) => {
    const deletedProduct = await productServices.deleteProductById(req.params.id)
    if (deletedProduct == 0) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Product ID. Product does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ deletedProduct })
})

module.exports = {
    addProduct,
    getAllProducts,
    getProductByID,
    updateProductById,
    updateProductQuantityById,
    deleteProductById
}