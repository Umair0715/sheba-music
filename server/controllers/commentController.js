const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Comment = require('../models/commentModel');
const { sendSuccessResponse } = require('../utils/helpers')



exports.createComment = catchAsync( async(req , res , next) => {
    const { postId , comment } = req.body;
    if(!postId || !comment){
        return next(new AppError('Missing required credentials.' , 400))
    }
    const newComment = await Comment.create({
        postId , comment , commentator : req.user._id 
    });
    return sendSuccessResponse(res , 200 , {
        comment : newComment 
    });
});

exports.deleteComment = catchAsync( async(req , res , next) => {
    const { commentId } = req.params;
    if(!commentId){
        return next(new AppError('Please provide comment id in params.' , 400))
    }
    await Comment.findByIdAndUpdate(commentId , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'Comment deleted successfully.'
    })
});

exports.getSinglePostComments = catchAsync( async(req , res , next) => {
    const { postId } = req.params;
    const pageSize = 10 ;
    const page = Number(req.query.page) || 1 ;
    if(!postId){
        return next(new AppError('Please provide post id in params.' , 400))
    }
    const docCount = await Comment.countDocuments({ post : postId , isActive : true });
    const comments = await Comment.find({ post : postId , isActive : true })
    .limit(pageSize).skip(pageSize * (page - 1 ));
    
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        page , pages , comments , docCount 
    });
});