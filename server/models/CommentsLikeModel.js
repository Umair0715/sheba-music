const mongoose = require('mongoose');

const commentsLikeSchema = new mongoose.Schema({
    commentId : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Comment' ,
        required : true 
    } ,
    like : {
        type : Number ,
        // 1 = true , 0 = false  
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User',
        required : true 
    }

} , { timestamps : true } );

const CommentsLike = mongoose.model('CommentsLike' , commentsLikeSchema);
module.exports = CommentsLike;