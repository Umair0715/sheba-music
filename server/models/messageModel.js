const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User',
        required : [true , 'Sender id is required.']
    } ,
    text : {
        type : String
    } ,
    image : {
        type : Object ,
    } ,
    type : {
        type : Number ,
        required : [true , 'Message type is required.'] 
        // 1 = text only , 2 = image only , 3 = text + image 
    } , 
    chat : {
        type : mongoose.Schema.ObjectId ,
        ref : "Chat" ,
        required : [true , 'Chat id is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    } ,
    isSeen : {
        type : Boolean ,
        default : false 
    }
} , { timestamps : true } );


const Message = mongoose.model('Message' , messageSchema);
module.exports = Message;