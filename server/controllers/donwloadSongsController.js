const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const DownloadSongs = require('../models/downloadSongsModel');

exports.addToSongsDownloads = catchAsync(async(req ,res ,next) => {
    const { song } = req.body;
    if(!song){
        return next(new AppError('song is required.' , 400))
    }
    const downloadSong = await DownloadSongs.create({
        song , user : req.user._id 
    });
    return sendSuccessResponse(res , 200 , {
        downloadSong 
    })
});

exports.deleteSongFromDownloads = catchAsync(async(req ,res , next) => {
    const { downloadId } = req.params;
    if(!downloadId){
        return next(new AppError('Please provide download id in params.' , 400))
    }
    await DownloadSongs.findByIdAndUpdate(downloadId , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'Song Removed from downloads.'
    })
});


exports.getMyDownloadSongs = catchAsync(async(req ,res ,next) => {
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    const downloadSongs = await DownloadSongs.find({ user : req.user._id , isActive : true })
    .populate('user' , 'name email phone')
    .populate({
        path : 'song' ,
        populate : {
            path : 'songCreator' ,
            select : 'name email phone'
        }
    }).limit(pageSize).skip(pageSize * (page - 1));
    const docCount = await DownloadSongs.countDocuments({ user : req.user._id , isActive : true });
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        downloadSongs , page , pages , docCount 
    }) 
});