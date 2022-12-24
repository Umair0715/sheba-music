const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const DownloadBeats = require('../models/downloadBeatsModel');

exports.addToBeatDownloads = catchAsync(async(req ,res ,next) => {
    const { beat } = req.body;
    if(!beat){
        return next(new AppError('Beat is required.' , 400))
    }
    const downloadBeat = await DownloadBeats.create({
        beat , user : req.user._id 
    });
    return sendSuccessResponse(res , 200 , {
        downloadBeat 
    })
});

exports.deleteBeatFromDownloads = catchAsync(async(req ,res , next) => {
    const { downloadId } = req.params;
    if(!downloadId){
        return next(new AppError('Please provide download id in params.' , 400))
    }
    await DownloadBeats.findByIdAndUpdate(downloadId , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'Beat Removed from downloads.'
    })
});


exports.getMyDownloadBeats = catchAsync(async(req ,res ,next) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const downloadBeats = await DownloadBeats.find({ user : req.user._id , isActive : true })
    .populate('user' , 'name email phone')
    .populate({
        path : 'beat' ,
        populate : {
            path : 'beatCreator' ,
            select : 'name email phone'
        }
    }).limit(pageSize).skip(pageSize * (page - 1));
    const docCount = await DownloadBeats.countDocuments({ user : req.user._id , isActive : true });
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        downloadBeats , page , pages , docCount 
    }) 
});