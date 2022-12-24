const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true ,
        minLength : 3 ,
        maxLength : 35 ,
    } ,
    email : {
        type : String , 
        trim : true ,
        match : [	
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/ ,
            'invalid email. please provide valid email adress'
        ],
        unique : true ,
    },
    password : {
        type : String ,
    } ,
    phone : {
        type : String ,
    } ,
    profileImage : {
        type : Object
    },
    coverImage : {
        type : Object
    },
    isAdmin : {
        type : Boolean ,
        default : false ,
    } ,
    country : {
        type : String ,
        trim : true ,    
    } ,
    state : {
        type : String ,
        trim : true
    } ,
    city : {
        type : String ,
        trim : true
    } ,
    userType : {
        type : Number ,
        enum : [0 , 1 , 2 , 3 , 4 , 5],
        default : 0 ,
        // 0 = guest , 1 = artist , 2 = songWriter , 3 = beatProducer , 4 = influencer , 5 = admin 
    } ,
    accountType : {
        type : String ,
        enum : ["facebook" , "google" , "phone" , "email" , "apple"],
        default : 'email'
    },
    socialLinks : [
        {
            name : {
                type : String ,
            } ,
            url : {
                type : String 
            }
        }
    ] ,
    fcmToken : {
        type : String ,
    } ,
    emailVerified : {
        type : Boolean , 
        default : false 
    } ,
    phoneVerified : {
        type : Boolean , 
        default : false 
    } ,
    verificationToken : String ,
    passwordResetToken : String ,
} , { timestamps : true } );


userSchema.pre('save' , async function(next){
    if(!this.isModified('password')){
        return;
    }
    this.password = await bcrypt.hash(this.password , 10);
    next();
});

userSchema.methods.comparePassword = async function(givenPassword) {
    return await bcrypt.compare(givenPassword , this.password);
}

const User = mongoose.model('User' , userSchema);
module.exports = User;