const mongoose = require('mongoose');


const likedBeatsSchema = new mongoose.Schema({
    beat : {
        type : mongoose.Schema.ObjectId ,
        ref : "Beat" ,
        required : [true , 'beat id is required.']
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User id is required.']
    } 
} , { timestamps : true });

const LikedBeats = mongoose.model('LikedBeat' , likedBeatsSchema);
module.exports = LikedBeats ;