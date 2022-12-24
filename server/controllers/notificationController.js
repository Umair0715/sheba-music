const catchAsync = require('../utils/catchAsync');
const Notification = require('../models/notificationModel');
const { sendSuccessResponse } = require('../utils/helpers');


exports.updateNotification = catchAsync( async(req , res , next) => {
    const { notificationId } = req.params;
    if(!notificationId){
        return next(new AppError('Please provide notification id in params.' , 400))
    }
    const updatedNotification = await Notification.findByIdAndUpdate(notificationId , req.body , { 
        new : true , 
        runValidators : true
    });
    return sendSuccessResponse(res , 200 , { notification : updatedNotification })
});

exports.getMyNotifications = catchAsync(async(req ,res ,next) => {
    const notification = await Notification.findOne({ user : req.user._id });
    return sendSuccessResponse(res , 200 , { notification })
})