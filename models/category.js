const e = require('express');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        rqeuired : true,
        maxlength : 32,
        unique : true
    }    
},{timestamps:true})


module.exports = mongoose.model("Category",categorySchema);