const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const FCM = require('../models/fcmModel');
const { sendSuccessResponse } = require('../utils/helpers')

exports.createFcmToken = catchAsync( async(req , res , next) => {
    const { fcm } = req.body;
    const user = req.user._id ;
    if(!fcm){
        return next(new AppError('Missing fcm token.' , 400))
    }
    const fcmExist = await FCM.findOne({ user });
    if(fcmExist){
        const updatedFcm = await FCM.findByIdAndUpdate(fcmExist._id , { fcm } , { 
            new : true ,
            runValidators : true 
        });
        return sendSuccessResponse(res , 200 , {
            fcm : updatedFcm
        })
    }else{
        const newFcm = await FCM.create({ 
            user , fcm 
        });
        return sendSuccessResponse(res , 201 , {
            fcm : newFcm 
        })
    }
});

exports.getMyFcmToken = catchAsync( async(req , res , next) => {
    const fcm = await FCM.findOne({ user : req.user._id });
    if(!fcm){
        return next(new AppError('fcm token not found.' , 404))
    }
    return sendSuccessResponse(res , 200 , {
        fcm 
    })
})