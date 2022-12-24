const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : [true , 'Song title is required.']
    } ,
    audio : {
        type : String ,
        required : [true, 'Song audio is required.'] 
    } ,
    songCover : {
        type : Object ,
        required : [true, 'Song cover is required.'] 
    } ,
    category : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Category',
        required : [true, 'Song category is required.'] 
    } ,
    license : {
        type : Object ,
        required : [true ,'License is required.']
        
        //type : 0/1 free/paid 
        //name : basic/premium/free,
        //amount : 0 , 
    } ,
    songCreator : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true, 'User is required who is going to create the song.'] 
    },
    isActive : {
        type : Boolean ,
        default : true 
    },
    type : {
        type : String ,
        default : 'song'
    }

} , { timestamps : true })

const Song = mongoose.model('Song' , songSchema);
module.exports = Song;