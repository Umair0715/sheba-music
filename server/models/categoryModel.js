const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true 
    } ,
    type : {
        type : String ,
        enum : ['genre' , 'mood']
    } ,
    isActive : {
        type : Boolean , 
        default : true 
    } ,

} , { timestamps : true });

const Category = mongoose.model('Category' , categorySchema);
module.exports = Category;