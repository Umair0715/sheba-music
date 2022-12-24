const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true 
    } ,
    email : {
        type : String,
        required : true
    } ,
    password : {
        type : String ,
        required : true 
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    }
} , { timestamps : true });

adminSchema.pre('save' , async function(next){
    if(!this.isModified('password')){
        return;
    }
    this.password = await bcrypt.hash(this.password , 10);
    next();
});

adminSchema.methods.comparePassword = async function(givenPassword) {
    return await bcrypt.compare(givenPassword , this.password);
}

const Admin = mongoose.model('Admin' , adminSchema);
module.exports = Admin ;