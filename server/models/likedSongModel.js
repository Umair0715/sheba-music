const mongoose = require('mongoose');


const likedSongsSchema = new mongoose.Schema({
    song : {
        type : mongoose.Schema.ObjectId ,
        ref : "Song" ,
        required : [true , 'Song id is required.']
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User id is required.']
    }
} , { timestamps : true });

const LikedSongs = mongoose.model('LikedSong' , likedSongsSchema);
module.exports = LikedSongs ;