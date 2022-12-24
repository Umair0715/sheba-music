const mongoose = require('mongoose');

const BuyBeatSchema = new mongoose.Schema({
    buyer : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'Buyer id is required.']
    } ,
    beat : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Beat' , 
        required : [true , 'beat id is required.']
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
    beatOwner : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'Beat owner id is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }

} , { timestamps : true});

const BuyBeat = mongoose.model('BuyBeat' , BuyBeatSchema);
module.exports = BuyBeat;