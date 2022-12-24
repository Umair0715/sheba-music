const mongoose = require('mongoose');

const favouriteArtistSchema = new mongoose.Schema({
    artists : [
        {
            artistId : {
                type : mongoose.Schema.ObjectId ,
                ref : 'User'
            }
        }
    ] ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : true 
    } ,
    isActive : {
        type : Boolean , 
        default : true 
    }
}, { timestamps : true } );


const FavouriteArtist = mongoose.model('FavouriteArtist' , favouriteArtistSchema);
module.exports = FavouriteArtist;

