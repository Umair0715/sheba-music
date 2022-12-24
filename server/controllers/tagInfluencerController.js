const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const TagInfluencer = require('../models/tagInfluencerModel');
const { sendSuccessResponse } = require('../utils/helpers');


exports.createInfluencerTag = catchAsync(async(req , res , next) => {
    const { _id } = req.user;
    const { influencer , profitPercentage } = req.body;
    if(!influencer || !profitPercentage){
        return next(new AppError('Missing required credentials.' , 400))
    }
    const isAlreadyInfluencer = await TagInfluencer.findOne({ 
        user : _id , 
        influencer , 
        isActive : true 
    });
    if(isAlreadyInfluencer){
        return next(new AppError('This person is already exist in your influencers list.' , 400))
    }
    let newInfluencer = await TagInfluencer.create({ 
        user : _id ,
        influencer ,
        profitPercentage
    });
    newInfluencer = await TagInfluencer.findById(newInfluencer._id)
    .populate('user' , 'name email phone')
    .populate('influencer' , 'name email phone');

    return sendSuccessResponse(res , 201 , {
        message : 'New influencer created.' ,
        influencer : newInfluencer
    });
});


exports.getMyInfluencers = catchAsync( async ( req ,res ,next) => {
    const influencers = await TagInfluencer.find({ 
        user : req.user._id , isActive : true 
    })
    .populate('user' , 'name email phone')
    .populate('influencer' , 'name email phone')
    return sendSuccessResponse(res , 200 , {
        influencers
    })
});

exports.deleteInfluencer = catchAsync( async(req , res , next) => {
    const { influencerId } = req.params;
    await TagInfluencer.findOneAndUpdate({ influencer : influencerId } , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'Influencer removed successfully.'
    })
});


exports.updateInfluencer = catchAsync( async ( req , res , next) => {
    const { influencerId } = req.params;
    const updatedInfluencer = await TagInfluencer.findOneAndUpdate( 
        { influencer : influencerId } , req.body , { 
        new : true ,
        runValidators : true 
    })
    .populate('user' , 'name email phone')
    .populate('influencer' , 'name email phone');
    return sendSuccessResponse(res , 200 , {
        message : 'Influencer updated successfully.', 
        influencer : updatedInfluencer
    });
});

exports.getSingleUserInfluencers = catchAsync( async ( req , res , next) => {
    const influencers = await TagInfluencer.find({ 
        user : req.params.userId , isActive : true 
    })
    .populate('user' , 'name email phone')
    .populate('influencer' , 'name email phone')

    return sendSuccessResponse(res , 200 , {
        influencers
    })
    
})