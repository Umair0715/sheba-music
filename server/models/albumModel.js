const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name : { 
        type : String , 
        required : true 
    } ,
    image : {
        type : Object ,
        required : [true , 'Album image is required.']
    },
    // songs : [
    //     {
    //         song : {
    //             type : mongoose.Schema.ObjectId ,
    //             ref : 'Song' ,
    //         }
    //     }
    // ],
    albumCreator : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User', 
        required : true
    },
    isActive : {
        type : Boolean ,
        default : true 
    } , 
    itemsCount : {
        type : Number ,
        default : 0 
    }
} , { timestamps : true });

const Album = mongoose.model('Album' , albumSchema);
module.exports = Album;