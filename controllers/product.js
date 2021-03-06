const Product = require('../models/product');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
        .populate('category')
        .exec((err,product) => {
            if(err || !product){
                res.status(400).json({
                    error:"Could not find product"
                });
            }
            req.product = product;
            next();
        });    
}


exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error:"problem with image"
            });
        }

        //destructure the fields
        const {name,description,price,category,stock} = fields;
        if(!name|| !description|| !price|| !category|| !stock){
            res.status(400).json({
                error:"Please include all fields"
            });
        }

        let product = new Product(fields);

        //handle file here
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        //save to db
        product.save((err,savedProduct) => {
            if(err){
                res.status(400).json({
                    error:"Saving tshirt in DB failed"
                });
            }
            res.status(200).json(savedProduct);
        });
    });
}   


exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.status(200).json(req.product);
}


exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            res.status(400).error({
                error:"Failed to delete product"
            });
        }
        res.status(400).json({
            message:"Deleted product",
            ...deletedProduct
        });
    });    
}


exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error:"problem with image"
            });
        }

        //updation code
        let product = req.product;
        product = _.extend(product,fields);

        //handle file here
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to db
        product.save((err,savedProduct) => {
            if(err){
                res.status(400).json({
                    error:"updation of product failed"
                });
            }
            res.status(200).json(savedProduct);
        });
    });
}


exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy,"asc"]])
        .limit(limit)
        .exec((err,products)=>{
            if(err || !products){
                return res.status(400).json({
                    error:"Not able to fetch products"
                });
            }
            res.status(200).json(products);
        });
}


exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err,categories) => {
        if(err){
            return res.status(400).json({
                error:"No Category found"
            });
        }
        res.status(200).json(categories);
    });
}


//middlewares
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}


exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(prod => {
        return{
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc: {stock:-prod.count,sold:+prod.count}}
            }
        }
    });
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            res.status(400).json({
                error:"Bulk operations failed"
            });
        }
        next();
    });
}