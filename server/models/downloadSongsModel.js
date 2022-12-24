const mongoose = require('mongoose');


const downloadSongsSchema = new mongoose.Schema({
    song : {
        type : mongoose.Schema.ObjectId ,
        ref : "Song" ,
        required : [true , 'Song id is required.']
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
} , { timestamps : true });

const DownloadSongs = mongoose.model('DownloadSong' , downloadSongsSchema);
module.exports = DownloadSongs ;