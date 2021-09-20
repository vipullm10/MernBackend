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
        //TODO:restrictions on fields
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