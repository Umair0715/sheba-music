const mongoose = require('mongoose');

const walletHistorySchema = new mongoose.Schema({
    type : {
        type : Number ,
        enum : [0 , 1 , 2 , 3] ,
        required : [true , 'Wallet history type is required.'] ,
        // 0 = deposit , 1 = withdrawal , 2 = earning , 3 = purchase
    } ,
    amount : {
        type : Number ,
        required : [true , 'Wallet History amount is required.']
    } ,
    description : {
        type : String ,
    } ,
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    wallet : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Wallet', 
        required : [true , 'Wallet is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }
}, { timestamps : true });

const WalletHistory = mongoose.model('WalletHistory' , walletHistorySchema);
module.exports = WalletHistory;