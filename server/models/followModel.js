const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : "User",
        required : [true , 'User id is required.']
    } ,
    follower : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'Follower id is required.']
    } ,
    isActive : {
        type : Boolean , 
        default : true 
    }
} , { timestamps : true } );

const Follow = mongoose.model('Follow' , followSchema);
module.exports = Follow;