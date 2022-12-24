const mongoose = require('mongoose');

const tagInfluencerSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'User is required.']
    } ,
    influencer : {
        type : mongoose.Schema.ObjectId ,
        ref : 'User' ,
        required : [true , 'Influencer is required.']
    } ,
    profitPercentage : {
        type : Number ,
        required : [true , 'Profit percentage is required.']
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }
}, { timestamps : true });

const TagInfluecner = mongoose.model('TagInfluencer' , tagInfluencerSchema);
module.exports = TagInfluecner;