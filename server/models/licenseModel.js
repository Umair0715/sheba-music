const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true 
    } ,
    price : {
        type : Number 
    } ,
    isActive : { 
        type : Boolean,
        default : true 
    },
    user : {
        type :mongoose.Schema.ObjectId ,
        ref : 'User',
        required : true 
    }
}, { timestamps : true } );

const License = mongoose.model('License' , licenseSchema);
module.exports = License;