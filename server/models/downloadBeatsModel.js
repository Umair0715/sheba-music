const mongoose = require('mongoose');


const downloadBeatsSchema = new mongoose.Schema({
    beat : {
        type : mongoose.Schema.ObjectId ,
        ref : "Beat" ,
        required : [true , 'Beat id is required.']
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User id is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }
} , { timestamps : true } );

const DownloadBeats = mongoose.model('DownloadBeat' , downloadBeatsSchema);
module.exports = DownloadBeats ;