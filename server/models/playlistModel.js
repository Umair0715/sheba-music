const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , 'Playlist name is required.']
    } ,
    image : {
        type : Object ,
        required : [true , 'Playlist image is required.']
    } ,
    itemsCount : {
        type : Number ,
        default : 0 
    } ,
    playlistCreator : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User', 
        required : true
    },
    isActive : {
        type : Boolean ,
        default : true 
    }
} , { timestamps : true });

const Playlist = mongoose.model('Playlist' , playlistSchema);
module.exports = Playlist;