const mongoose = require('mongoose');


const albumItemsSchema = new mongoose.Schema({
    item : {
        type : String ,
        required : true 
    } ,
    album : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Album' ,
        required : true 
    } ,
    type : {
        type : Number ,
        // 1 = song , 2 = beat 
    } , 
}, { timestamps : true });

const AlbumItems = mongoose.model('AlbumItem' , albumItemsSchema);
module.exports = AlbumItems;