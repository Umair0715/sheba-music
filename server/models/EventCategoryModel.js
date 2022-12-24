const mongoose = require('mongoose');


const eventCategorySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true 
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    },
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User'
    }
}, { timestamps : true });

const EventsCategory = mongoose.model('EventsCategory' , eventCategorySchema);
module.exports = EventsCategory;