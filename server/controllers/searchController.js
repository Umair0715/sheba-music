const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Song = require('../models/songModel');
const Beat = require('../models/beatModel');
const { sendSuccessResponse } = require('../utils/helpers');

// 0 = guest , 1 = artist , 2 = songWriter , 3 = beatProducer , 4 = influencer
exports.search = catchAsync( async(req , res , next) => {
    const { type } = req.query;
    const keyword = type === 'song' || type === 'beat' ? {
        title : {
           $regex : req.query.keyword ,
           $options : 'i'
        }
    } : {
        name : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } ;
    const page = Number(req.query.page) || 1;
    const pageSize = 10;
    let data ;
    if(type === 'song'){ 
        data = await Song.find(keyword)
        .limit(pageSize).skip(pageSize * (page - 1 ));
    }else if(type === 'beat'){ 
        data = await Beat.find(keyword)
        .limit(pageSize).skip(pageSize * (page - 1 ));
    }else if(type === 'artist'){
        data = await User.find({ ...keyword , userType : 0 , isActive : true })
        .limit(pageSize).skip(pageSize * (page - 1 ));
    }else if(type === 'songWriter'){ 
        data = await User.find({ ...keyword , userType : 2 , isActive : true })
        .limit(pageSize).skip(pageSize * (page - 1 ));
    }else if(type === 'beatProducer'){ 
        data = await User.find({ ...keyword , userType : 3 , isActive : true })
        .limit(pageSize).skip(pageSize * (page - 1 ));
    }else if(type === 'influencer'){ 
        data = await User.find({ ...keyword , userType : 4 , isActive : true })
        .limit(pageSize).skip(pageSize * (page - 1 ));
    }else {
        data = await Song.find().limit(pageSize).skip(pageSize * (page - 1 ))
    }

    return sendSuccessResponse(res , 200 , {
        data 
    })
});