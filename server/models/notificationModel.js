const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User id is required.']
    } ,
    newSongNotify : {
        type : Number ,
        default : 0 
    } ,
    artistMessageNotify : {
        type : Number ,
        default : 0 
    } ,
    transactionNotify : {
        type : Number ,
        default : 0 
    } ,
    purchaseNotify : {
        type : Number ,
        default : 0 
    } ,
    ticketNotify : {
        type : Number ,
        default : 0 
    } ,
    liveStreamNotify : {
        type : Number ,
        default : 0 
    } , 
    marketingNotify : {
        type : Number ,
        default : 0 
    } , 
    reportNotfify : Number ,
    playMilestoneNotify : Number ,
    newSuporterNotify : Number ,
    influencerTagNotify : Number , 
} , { timeStamps : true } );

const Notification = mongoose.model('Notification' , notificationSchema);
module.exports = Notification;