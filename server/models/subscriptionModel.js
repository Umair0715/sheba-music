const mongoose = require('mongoose');


const subscriptionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : "User",
        required : true
    } ,
    package : {
        type : mongoose.Schema.ObjectId ,
        ref : "Package",
        required : true
    } ,
    endDate : {
        type : Date ,  
        required : true 
    },
    isActive : {
        type : Boolean ,
        default : true
    }
} , { timestamps : true });

const Subscription = mongoose.model('Subscription' , subscriptionSchema);
module.exports = Subscription;