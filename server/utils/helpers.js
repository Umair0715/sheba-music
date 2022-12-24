const path = require('path');
var base64ToImage = require('base64-to-image');
const fs = require('fs');
// const totp = require('totp-generator');
const customId = require('custom-id');
const jwt = require('jsonwebtoken');
const WalletHistory = require('../models/walletHistoryModel');
const Song = require('../models/songModel');
const Beat = require('../models/beatModel');
const Subscription = require('../models/subscriptionModel');
const moment = require('moment');


exports.sendSuccessResponse = ( res , statusCode = 200 , data ) => {
    res.status(statusCode).json({
        status : 'success' ,
        success : true ,
        data 
    })
}

exports.sendErrorResponse = ( res , statusCode = 400 , data ) => {
    res.status(statusCode).json({
        status : 'error' ,
        success : false ,
        data 
    })
}

exports.uploadImage = ( string , directory ) => {
    var base64Str = string ;
    var uploadPath = directory ? path.join(__dirname , `../uploads/${directory}/`) : path.join(__dirname  , '../uploads/');
    const imageName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    var optionalObj = {'fileName': imageName , 'type':'jpg'};
    return base64ToImage(base64Str , uploadPath , optionalObj); 
}

exports.uploadSong = ( string , res ) => {
    const songName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    fs.writeFileSync(path.resolve('server/uploads/songs' , `${songName}.mp3`) , Buffer.from(string.replace('data:audio/mp3; codecs=opus;base64,', ''), 'base64') , (err) => {
        if(err){
            return sendErrorResponse(res , 500 , { 
                message : 'Internal server error'
            })
        }
    });
    return songName + '.mp3';
}

exports.uploadBeat = ( string , res ) => {
    const beatName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    fs.writeFileSync(path.resolve('server/uploads/beats' , `${beatName}.mp3`) , Buffer.from(string.replace('data:audio/mp3; codecs=opus;base64,', ''), 'base64') , (err) => {
        if(err){
            return sendErrorResponse(res , 500 , { 
                message : 'Internal server error'
            })
        }
    });
    return beatName + '.mp3';
}

exports.generateToken = (name , email) => {
    const token = customId({
        name , 
        email , 
    }).slice(0,6);
    return token;
}


exports.signToken = (payload) => {
    return jwt.sign( payload , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES
    })
};

exports.sendCookie = (res , token) => {
    let cookieOptions =  {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly : true
    }
    if(process.env.NODE_ENV === "production") cookieOptions.secure = true ;
    return res.cookie('token' , token  , cookieOptions  );
}


exports.createWalletHistory = async (type , amount , user , wallet , description) => {
    await WalletHistory.create({ 
        type , 
        amount ,
        user ,
        wallet , 
        description 
    })
}

exports.countSongs = async userId =>  await Song.countDocuments({ user : userId , isActive : true });

exports.countBeats = async userId => await Beat.countDocuments({ user : userId , isActive : true });

exports.isSubscribed = async (user) => {
    const subscription = await Subscription.findOne({ user , isActive : true , endDate : { $gt : Date.now() }});
    return subscription ? true : false ;
}
