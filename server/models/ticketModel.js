const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    eventName : {
        type : String ,
        required: [true , 'Event name is required.'] 
    } ,
    singerName : {
        type : String , 
        required : [true , 'Singer name is required.']  
    },
    ticketsAvailable : {
        type : Number ,
        required : [true , 'Total number of tickets is required.'] ,
    } ,
    eventCategory : {
        type : mongoose.Schema.ObjectId ,
        ref : 'EventsCategory', 
    },
    location : {
        address : {
            type : String ,
        },
        lat : {
            type : String 
        } ,
        lng : {
            type : String 
        },
    } ,
    image : {
        type : Object , 
    },
    dateAndTime : {
        type : String ,
        required : [true , 'Event date and time is required.'] 
    } ,
    description : {
        type : String 
    } ,
    variants : [
        {
            name : String ,
            price : Number 
        }
    ] ,
    ticketCreator : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User', 
        required : [true , 'Ticket owner is required.']
    },
    isActive : {
        type : Boolean  ,
        default : true 
    }
}, { timestamps : true });

const Ticket = mongoose.model('Ticket' , ticketSchema);
module.exports = Ticket;
