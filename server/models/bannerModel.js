const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    images : [
        {
            fileName : {
                type : String 
            } ,
            imageType : {
                type : String 
            }
        }
    ] ,
    isActive : {
        type : Boolean ,
        default : true 
    }
}, { timestamps : true });

const Banner = mongoose.model('Banner' , bannerSchema);
module.exports = Banner;