const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    deposit : {
        type : Number , 
        default : 0
    } ,
    withdrawal : {
        type : Number ,
        default : 0 
    } ,
    earning : {
        type : Number ,
        default : 0 ,
    },
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    totalBalance : {
        type : Number ,
        default : 0 
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }

} , { timestamps : true });

const Wallet = mongoose.model('Wallet' , walletSchema);
module.exports = Wallet;