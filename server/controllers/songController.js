const fs = require('fs');
const path = require('path');
const Song = require('../models/songModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendErrorResponse , sendSuccessResponse , uploadImage , countBeats , countSongs , isSubscribed } = require('../utils/helpers');


const convertToMp3 = ( string , res ) => {
    const songName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    fs.writeFileSync(path.resolve('server/uploads/songs' , `${songName}.mp3`) , Buffer.from(string.replace('data:audio/mp3; codecs=opus;base64,', ''), 'base64') , (err) => {
        if(err){
            return sendErrorResponse(res , 500 , { 
                message : 'Internal server error'
            })
        }
    });
    return songName + '.mp3';
}


// /api/song => POST => public
exports.createSong = catchAsync(async (req , res , next ) => {
    const { audio , songCover , title , category , license , type } = req.body;
    if(!audio || !songCover || !title || !category){
        return next(new AppError("Missing required credentials." , 400))
    }
    if(req.user.userType === 1 || req.user.userType === 2){ // artist/writer
        const songsCount = await countSongs(req.user._id);
        const isUserSubscribed = await isSubscribed(req.user);
        if(!isUserSubscribed && (songsCount === 10 || songsCount > 10)){
            return next(new AppError('You have reached your upload limit.To upload more songs please upgrade your plan or buy a plan.' , 400))
        }
    }
    if(req.user.userType === 3 ){ // Producer 
        const songsCount = await countSongs(req.user._id);
        const beatsCount = await countBeats(req.user._id);
        const isUserSubscribed = await isSubscribed(req.user);
        const uploadCount = songsCount + beatsCount;
        if(!isUserSubscribed && (uploadCount === 10 || uploadCount > 10)){
            return next(new AppError('You have reached your upload limit.To upload more songs/beats please upgrade your plan or buy a plan.' , 400))
        }
    }
    const _audio = convertToMp3(audio , res);
    const _songCover = uploadImage(songCover , 'songCovers');
    //remaining album part (if album => add current song in that album)
    const newSong = await Song.create({ 
        audio : _audio ,
        songCover : _songCover ,
        title ,
        category ,
        license: license ? license : { 
            type : 0 , 
            name : 'free' , 
            amount : 0 
        } ,
        type ,
        songCreator : req.user._id 
    });
    return sendSuccessResponse(res , 201 , { 
        message : 'Song created.', 
        song : newSong 
    })
});


// /api/song => GET => public
exports.getSongs = catchAsync( async(req , res , next) => {
    const songs = await Song.find({ isActive : true }).populate('songCreator' , 'name email phone')
    .populate({
        path : 'category', 
        populate : {
            path : 'parentId',
        }
    });
    
    return sendSuccessResponse(res , 200 , { 
        songs 
    })
});


// /api/song/:id => PUT => public
exports.updateSong = catchAsync( async (req , res , next ) => {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id , req.body , {
        new : true 
    }).populate('songCreator' , 'name email phone');

    return sendSuccessResponse(res , 200 , { 
        message : 'Song updated.',
        song : updatedSong
    })
});


// /api/song/:id => DELETE => public
exports.deleteSong = catchAsync( async (req , res , next ) => {
    const { id } = req.params;
    await Song.findByIdAndUpdate(id , {
        isActive : false 
    });
    return sendSuccessResponse(res , 200 , {
        message : 'Song deleted.'
    })
});


exports.getSingleSong = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    const song = await Song.findById(id)
    .populate('songCreator' , 'name email phone')
    .populate({
        path : 'category', 
        populate : {
            path : 'parentId',
        }
    });
    return sendSuccessResponse(res , 200 , {
        song 
    })
});
