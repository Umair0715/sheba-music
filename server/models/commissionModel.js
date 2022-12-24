const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    commissionType : {
        type : Number ,
        required : true 
        // 0 = guest , 1 = artist , 2 = songWriter , 3 = beatProducer , 4 = influencer
    } ,
    commission : {
        type : Number ,
        required : true 
        //in percentage
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }
}, { timestamps : true } );

const AdminCommission = mongoose.model('AdminCommission' , commissionSchema);
module.exports = AdminCommission;