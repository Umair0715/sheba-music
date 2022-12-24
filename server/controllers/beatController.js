const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Beat = require('../models/beatModel');
const { sendErrorResponse , sendSuccessResponse , uploadImage , countBeats , countSongs , isSubscribed } = require('../utils/helpers');


// /api/beat => POST => public
exports.createBeat = catchAsync(async (req , res , next ) => {
    const { audio , beatCover , title , category , license} = req.body;
    if(!audio || !beatCover || !title || !category ){
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
    const _audio = uploadBeat(audio , res);
    const _beatCover = uploadImage(beatCover , 'beatImages');
    //remaining album part (if album => add current beat in that album)
    let newBeat = await Beat.create({ 
        audio : _audio ,
        beatCover : _beatCover ,
        title ,
        category ,
        license: license ? license : { 
            type : 0 , 
            name : 'free' , 
            amount : 0 
        } ,
        beatCreator : req.user._id 
    });
    newBeat = await Beat.findById(newBeat._id)
    .populate('beatCreator' , 'name email phone')
    .populate('category', '')

    return sendSuccessResponse(res , 201 , { 
        message : 'Beat created.', 
        beat : newBeat 
    })
});


// /api/beat => GET => public
exports.getBeats = catchAsync( async(req , res , next) => {
    const pageSize = 2;
    const page = Number(req.query.page) || 1;

    const beats = await Beat.find({ isActive : true }).limit(pageSize).skip(pageSize * (page -1 )).populate('beatCreator' , 'name email phone');
    return sendSuccessResponse(res , 200 , { 
        results : beats.length ,
        beats  
    })
});


//  /api/beat/my => GET => //  /api/beat/my => GET => Protected 
exports.getMyBeats = catchAsync( async(req , res , next) => {
    const pageSize = 1;
    const page = Number(req.query.page) || 1;
    const beats = await Beat.find({ isActive : true , beatCreator : req.user._id })
    .limit(pageSize).skip(pageSize * (page - 1))
    .populate('beatCreator' , 'name email phone')
    .populate('category' , 'name parentId');

    return sendSuccessResponse(res , 200 , {
        results : beats.length ,
        beats 
    });
});




// /api/beat/:id => PUT => public
exports.updateBeat = catchAsync( async (req , res , next ) => {
    const updatedBeat = await Beat.findByIdAndUpdate(req.params.id , req.body , {
        new : true 
    })
    .populate('beatCreator' , 'name email phone')
    .populate('category' , 'name parentId')

    return sendSuccessResponse(res , 200 , { 
        message : 'Beat updated.',
        beat : updatedBeat
    });
});


// /api/beat/:id => DELETE => public
exports.deleteBeat = catchAsync( async (req , res , next ) => {
    const { id } = req.params;
    await Beat.findByIdAndUpdate(id , {
        isActive : false 
    });
    return sendSuccessResponse(res , 200 , {
        message : 'Beat deleted.'
    })
});


exports.getSingleBeat = catchAsync( async (req , res , next ) => {
    const { id } = req.params;
    const beat = await Beat.findOne({ _id : id , isActive : true })
    .populate('beatCreator' , 'name email phone')
    .populate('category' , 'name parentId')

    return sendSuccessResponse(res , 200 , {
        beat 
    })
});

