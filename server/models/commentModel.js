const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId : {
        type : String ,
        required : true 
    },
    comment : {
        type : String ,
        required : true 
    },
    commentator : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : true 
    },
    likesCount : {
        type : Number ,
        default : 0 , 
    },
    isActive : {
        type : Boolean ,
        default : true 
    }
} , { timestamps : true });

const Comment = mongoose.model('Comment' , commentSchema);
module.exports = Comment;