const {Order,ProductCart, order} = require('../models/order');


exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate('products.product','name price')
    .exec((err,order) => {
        if(err){
            res.status(400).json({
                error:"Could not find order"
            });
        }
        req.order = order;
        next();
    });
}


exports.createOrder = (req,res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,savedOrder) => {
        if(err){
            res.status(400).json({
                error:"Couln't save order"
            });
        }
        res.json(savedOrder);
    });
}


exports.getAllOrders = (req,res) => {
    Order.find()
        .populate('user','_id name')
        .exec((err,orders) => {
            if(err){
                res.status(400).json({
                    error:"Could't find orders"
                });
            }
            res.status(200).json(orders);
        });
}


exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path('status').enumValues);
}

exports.updateStatus = (req,res) => {
    Order.update(
        {_id:req.body.orderId},
        {$set:{status:req.body.status}},
        (err,order) => {
            if(err){
                return res.status(400).json({
                    error:"Cannot update order status"
                });
            }
            res.status(200).json(order);
        }
    )
}