const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const CommentLike = require('../models/CommentsLikeModel');
const { sendSuccessResponse } = require('../utils/helpers');
const Comment = require('../models/commentModel');

exports.createCommentLike = catchAsync( async(req , res , next) => {
    const { commentId } = req.body;
    if(!commentId){
        return next(new AppError('Please provide comment id' , 400))
    }
    const likeExist = await CommentLike.findOne({ user : req.user._id , commentId , like : 1 });
    if(likeExist){
        await CommentLike.findByIdAndRemove(likeExist._id);
        let _comment = await Comment.findById(likeExist.commentId);
        if(_comment.likesCount > 0){
            _comment.likesCount -= 1;
            await _comment.save();
        }
        return sendSuccessResponse(res , 200 , {
            message : 'Like removed.'
        });
    }
    await CommentLike.create({ 
        commentId , like : 1 , user : req.user._id 
    });
    let _comment = await Comment.findById(commentId);
    _comment.likesCount += 1;
    await _comment.save();
    return sendSuccessResponse(res , 201 , {
        message : 'Like created.'
    });
});