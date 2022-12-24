const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Subscription = require('../models/subscriptionModel');
const { sendSuccessResponse } = require('../utils/helpers');
const Package = require("../models/packageModel");
const moment = require('moment');

const endDate = (value , name) => {
    return moment().add(value , name).toDate();
}

exports.createSubscription = catchAsync(async ( req , res , next ) => {
    let { packageId } = req.body;
    const package = await Package.findOne({ _id : packageId , isActive : true });
    if(!package) return next(new AppError('Package not found.' , 400))
    const subscriptionExist = await Subscription.findOne({ user : req.user._id , endDate : { $gt : Date.now() }});

    if(subscriptionExist){
        if(subscriptionExist.package.toString() === package._id.toString()){
            //subscriptoin already exist
            return next(new AppError('You have already subscribed to this package.' , 400));
        }else {
            //plan updated
            const updatedSubscription = await Subscription.findByIdAndUpdate(subscriptionExist._id , {
                package ,
                endDate : package.duration === 1 ? endDate(1 , 'month') : package.duration === 2 ? endDate(6, 'month') : package.duration === 3 ? endDate(1 , 'year')
                : endDate(1 , 'month') ,
            });
            return sendSuccessResponse(res , 200 , {
                message : 'Subscription Updated.' ,
                subscription : updatedSubscription 
            })
        }
    }
    const subscription = await Subscription.create({
        user : req.user._id , 
        endDate : package.duration === 1 ? endDate(1 , 'month') : package.duration === 2 ? endDate(6, 'month') : package.duration === 3 ? endDate(1 , 'year') : endDate(1 , 'month') ,
        package : package._id 
    }) 
    return sendSuccessResponse(res , 200 , {
        message : 'Subscription Created.' ,
        subscription  
    })
});

exports.getMySubscription = catchAsync( async ( req , res ) => {
    const subscription = await Subscription.findOne({ user : req.user._id , isActive : true , endDate : { $gt : Date.now() }})
    .populate('user' , 'name email phone')
    .populate('package' , 'name price duration features');
    return sendSuccessResponse(res , 200 , {
        subscription
    }) 
});


exports.getAllSubscriptions = catchAsync(async(req , res ) => {
    const subscription = await Subscription.findOne({ isActive : true , endDate : { $gt : Date.now() }})
    .populate('user' , 'name email phone')
    .populate('package' , 'name price duration features');
    return sendSuccessResponse(res , 200 , {
        subscription
    }) 
});

