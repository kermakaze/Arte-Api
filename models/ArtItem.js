// jshint esversion: 6
//requiring node modules.
const mongoose = require('mongoose');

//creating Schema.
let itemSchema = new mongoose.Schema({
    price: {type:String, required: true},
    category: String,
    sellerId: {type:String, required: false, ref: 'Users'},
    description: {required:true, type: String},
    thumbnailUrl: String,
    fullResUrl: {type:String, required:true}
});

//items model
item = mongoose.model('Items', itemSchema);

module.exports = item;