const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    postId : {
        type : String ,
        required : true 
    } ,
    postType : {
        type : Number , 
        required : [true , 'Post type is required.']
    } ,
    // 1 = song , 2 = beat , 3 = ticket 
    like : {
        type : Number ,
        // 1 = like , 0 = noLike 
    },
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : true 
    }
} , { timestamps : true });

const Like = mongoose.model('Like' , likeSchema);
module.exports = Like;