const category = require('../models/category');
const Category = require('../models/category');

//get category by id 
exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,category) => {
        if(err){
            return res.status(400).json({
                error:"Category not found"
            });
        }
        req.category = category;
        next();
    });
}

//create a new category
exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((err,categoryItem) => {
        if(err){
            return res.status(400).json({
                error:"Not able to save category"
            });
        }
        res.status(200).json({category:{...categoryItem._doc}});
    });
}


//returns the json for category
exports.getCategory = (req,res) => {
    return res.status(200).json(req.category);
}


//get all categories
exports.getAllCategories = (req,res) => {
    Category.find().exec((err,categories) => {
        if(err || !categories){
            return res.status(400).json({
                error:"No categories found"
            });
        }
        res.status(200).json(categories);
    });
}


//update category info
exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err,updatedCategory) => {
        if(err || !updatedCategory){
            return res.status(400).json({
                error:"Not able to update "
            });
        }
        res.status(200).json(updatedCategory);
    });
}


//delete a category
exports.removeCategory = (req,res) => {
    const category = req.category;
    category.remove((err,deletedCategory) => {
        if(err){
            return res.status(400).json({
                error:"Not able to delet category"
            });
        }
        res.status(200).json({
            message : `${deletedCategory.name} category is successfully deleted`
        });
    });
}