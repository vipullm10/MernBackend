const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
    product : {
        type : ObjectId,
        ref : "Product"
    },
    name : String,
    count : Number,
    price : Number
});

const productCart = mongoose.model("ProductCart",productCartSchema);

const orderSchema = new mongoose.Schema({
    products : [productCartSchema],
    transaction_id : {},
    amount : { type : Number },
    address : String,
    status:{
        type:String,
        default:"",
        enum:["Cancelled","Delivered","Shipped","Processing","Recevied"]
    },
    update : Date,
    user : {
        type : ObjectId,
        ref : "User"
    }
},{timestamps:true});

const order = mongoose.model("Order",orderSchema);


module.exports = {order,productCart};