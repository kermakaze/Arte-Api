// jshint esversion: 6
//requiring node modules.
const mongoose = require('mongoose');

//creating Schema.
let UserSchema = new mongoose.Schema({
    username: {required: true, type: String, unique: true, index: true},
    googleId: {type:String, required: true, unique: true, index:true},
    profilePhotoUrl: {type: String, required: true}
});

//user model
user = mongoose.model('Users', UserSchema);

module.exports = user;