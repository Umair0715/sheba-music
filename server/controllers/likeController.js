const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Like = require('../models/likeModel');
const { sendSuccessResponse } = require('../utils/helpers');
const LikedSongs = require('../models/likedSongModel');
const LikedBeats = require('../models/likedBeatsModel');


exports.createLike = catchAsync( async(req , res , next) => {
    const { postId , postType } = req.body; 
    // type => 1 = song , 2 = beat , 3 = ticket 
    if(!postId || postType === undefined){
        return next(new AppError('Please provide both postId and postType.' , 400))
    }   
    const likeExist = await Like.findOne({ postId , user : req.user._id , like : 1 , postType })
    if(likeExist){
        await likeExist.remove();
        if(postType === 1){ // means song 
            await LikedSongs.findOneAndRemove({ song : postId , user : req.user._id })
        }
        if(postType === 2) { // means beat
            await LikedBeats.findOneAndRemove({ beat : postId , user : req.user._id })
        }
        return sendSuccessResponse(res , 200 , {
            message : 'Like removed.'
        })
    }
    await Like.create({ postId , like : 1 , user : req.user._id  , postType });
    if(postType === 1){ // means song 
        await LikedSongs.create({ song : postId , user : req.user._id })
    }
    if(postType === 2) { // means beat
        await LikedBeats.create({ beat : postId , user : req.user._id })
    }
    return sendSuccessResponse(res , 201 , {
        message : "Like created."
    })
});

exports.getPostLikes = catchAsync( async(req , res , next) => {
    const { postId } = req.params;
    if(!postId){
        return next(new AppError('Please provide post id in params.' , 400))
    }
    const likesCount = await Like.countDocuments({ postId });
    return sendSuccessResponse(res , 200 , {
        likesCount 
    })
});


exports.getMyLikedSongs = catchAsync(async(req , res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const likedSongs = await LikedSongs.find({ user : req.user._id })
    .populate('user' , 'name email phone')
    .populate({
        path : 'song' ,
        populate : {
            path : 'songCreator' ,
            select : 'name email phone'
        }
    }).limit(pageSize).skip(pageSize * (page - 1));
    const docCount = await LikedSongs.countDocuments({ user : req.user._id });
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        likedSongs , page , pages , docCount 
    }) 
});


exports.getMyLikedBeats = catchAsync(async(req , res) => {
    console.log('reached')
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const likedBeats = await LikedBeats.find({ user : req.user._id })
    .populate('user' , 'name email phone')
    .populate({
        path : 'beat' ,
        populate : {
            path : 'beatCreator' ,
            select : 'name email phone'
        }
    }).limit(pageSize).skip(pageSize * (page - 1));
    const docCount = await LikedBeats.countDocuments({ user : req.user._id });
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        likedBeats , page , pages , docCount 
    }) 
});