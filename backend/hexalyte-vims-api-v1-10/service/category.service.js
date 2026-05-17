const db = require("../models");
const Category = db.category;

// Add New category
const addNewCategory = async (params) => {
  const { Name, Description } = params;
  const category = { Name, Description, isActive: 1 };
  
  const categoryrow = await Category.create(category)
  return categoryrow
};

// Get All category
const getAllCategory = async (filter, options) => {
  const category = await Category.findAll();
  return category;
};

// Get category By Id
const getCategoryById = async (catId) => {
  const category = await Category.findOne({ where: { CategoryID: catId } });
  return category;
};

// Update category By Id
const updateCategoryById = async (catId, updateBody) => {
  const { Name, Description } = updateBody;
  const category = {
    Name,
    Description,
  };
  const row = await Category.update(category, { where: { CategoryID: catId } });
  return {message : "Category successfully updated"};
};

// Delete category By Id
const deleteCategoryById = async (catId) => {
  // const row = await Category.destroy({ where: { CategoryID: catId } });
  const row = await Category.update( {isActive: 0}, {where: { CategoryID: catId }})
  return {message: "Category successfully deleted"};
};

module.exports = {
    addNewCategory,
    getAllCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
};
