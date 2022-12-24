const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Follow = require('../models/followModel')
const { sendSuccessResponse } = require('../utils/helpers');


exports.createFollower = catchAsync( async(req , res , next) => { 
    const { user } = req.body;
    const follower = req.user._id ;
    if(!user){
        return next(new App('Follower id is required.' , 400))
    }
    const followerExist = await Follow.findOne({ user , follower , isActive : true });
    if(followerExist){
        return next(new AppError('Follower already exist' , 400))
    }
    let newFollower = await Follow.create({ user , follower })
    newFollower = await Follow.findById({ _id : newFollower._id})
    .populate('user' , 'name email phone')
    .populate('follower' , 'name email phone');

    return sendSuccessResponse(res , 201 , {
        message : "New follower added." , 
        follower : newFollower 
    });
});

exports.getMyFollowers = catchAsync( async(req , res , next) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const docCount = await Follow.countDocuments({ user : req.user._id , isActive : true });
    const followers = await Follow.find({ user : req.user._id , isActive : true }).limit(pageSize).skip(pageSize * (page - 1 ))
    .populate('user' , 'name email phone')
    .populate('follower' , 'name email phone');
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        followers , page , pages , docCount
    })
});

exports.unFollowUser = catchAsync( async(req , res , next) => {
    const { userId } = req.params;
    await Follow.findOneAndUpdate({ user : userId , follower : req.user._id } , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'Done',
    }) 
});

exports.getSingleUserFollowers = catchAsync( async(req , res , next) => {
    const pageSize = 10 ;
    const page = Number(req.query.page) || 1;
    const docCount = await Follow.countDocuments({ user : req.params.userId , isActive : true });
    const followers = await Follow.find({ user : req.params.userId  , isActive : true })
    .limit(pageSize).skip(pageSize * (page - 1 ))
    .populate('user' , 'name email phone')
    .populate('follower' , 'name email phone')

    const pages = Math.ceil(docCount/pageSize)

    return sendSuccessResponse(res , 200 , {
        followers , page , pages , docCount
    })
});

exports.getMyFollowings = catchAsync( async(req , res , next) => {
    const pageSize = 10 ;
    const page = Number(req.query.page) || 1;
    const docCount = await Follow.countDocuments({ follower : req.user._id , isActive : true });
    const followings = await Follow.find({ follower : req.user._id , isActive : true })
    .limit(pageSize).skip(pageSize * (page - 1 ))
    .populate('user' , 'name email phone')
    .populate('follower' , 'name email phone');
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        followings , page , docCount , pages 
    })
});

exports.getSingleUserFollowings = catchAsync( async(req , res , next) => {
    const pageSize = 10 ;
    const page = Number(req.query.page) || 1;
    const docCount = await Follow.countDocuments({ follower : req.params.userId , isActive : true });
    const followings = await Follow.find({ follower : req.params.userId , isActive : true })
    .limit(pageSize).skip(pageSize * (page - 1 ))
    .populate('user' , 'name email phone')
    .populate('follower' , 'name email phone');

    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        page , pages , followings , docCount 
    })
});