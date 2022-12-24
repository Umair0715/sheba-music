const mongoose = require('mongoose');

const fcmSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : true 
    } ,
    fcm : {
        type : String,
        required : true 
    }
}, { timestamps : true });

const FCM = mongoose.model('FCM' , fcmSchema);
module.exports = FCM;