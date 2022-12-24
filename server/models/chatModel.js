const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({ 
    users : [
        {
            type : mongoose.Schema.ObjectId ,
            ref : 'User'
        }
    ],
    latestMessage : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Message',
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    },
    chatName : String , 
    isAdminChat : {
        type : Boolean ,
        default : false 
    }
}, { timestamps : true } );

const Chat = mongoose.model('Chat' , chatSchema);
module.exports = Chat;