const mongoose = require('mongoose');

const beatsCategorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true 
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }
} , { timestamps : true });

const BeatsCategory = mongoose.model('BeatsCategory' , beatsCategorySchema);
module.exports = BeatsCategory;