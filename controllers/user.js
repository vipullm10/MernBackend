const User = require('../models/user');
const Order = require('../models/order');

//query user details with user id
exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error:"No user was found"
            });
        }
        req.profile = user;
        next();
    });
};


//return the req.profile object set in the above method as a json response
exports.getUser = (req,res) => {
    //TODO : get back here for password
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.status(200).json(req.profile);
};



//update user details based on userid
exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user) => {
            if(err || !user){
                return res.status(400).json({
                    error:"Update was unsuccessful"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            res.status(200).json(user);
        }
    );
}


//get all the orders placed by the user
exports.userPurchaseList = (req,res) => {
    Order.find({user:req.profile._id})
        .populate('user','_id name email')
        .exec((err,order) => {
            if(err){
                return res.status(400).json({error:"No orders placed"});
            }
            return res.status(200).json(order);
        });
}


//add an order to the user's purchase list
exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        });
    });
    //store this in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error:"Unable to save purchase list"
                });
            }
            next();
        }
    );
}