const mongoose = require('mongoose');

const buySongSchema = new mongoose.Schema({
    buyer : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'Buyer id is required.']
    } ,
    song : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Song' , 
        required : [true , 'Song id is required.']
    } ,
    amount : { 
        type : Number ,
        required : true ,
    } ,
    buyStatus : {
        type : Boolean ,
    } ,
    paymentMethod : {
        type : Number,
        default : 0 ,
        // 0 = wallet , 1 = paymentGateway
    } ,
    influencer : { 
        type : mongoose.Schema.ObjectId ,
        ref : 'User'  
    } ,
    songOwner : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'Song owner id is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }

} , { timestamps : true});

const BuySong = mongoose.model('BuySong' , buySongSchema);
module.exports = BuySong;