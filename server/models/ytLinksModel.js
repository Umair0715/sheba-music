const mongoose = require('mongoose');

const ytLinksSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    link : {
        type : String ,
        required : [true , 'Link is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true
    }
}, { timestamps : true });

const YoutubeLinks = mongoose.model('YoutubeLink' , ytLinksSchema);
module.exports = YoutubeLinks;