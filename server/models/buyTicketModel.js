const mongoose = require('mongoose');

const butTicketSchema = new mongoose.Schema({
    buyer : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : true  
    } ,
    ticket : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Ticket' , 
        required : true 
    } ,
    amount : {
        type : Number ,
        required : true 
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
        ref : 'User' ,
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }
}, { timestamps : true });

const BuyTicket = mongoose.model('BuyTicket' , butTicketSchema);
module.exports = BuyTicket;