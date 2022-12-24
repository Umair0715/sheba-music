const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Banner = require('../../models/bannerModel');
const path = require('path');
var base64ToImage = require('base64-to-image');
const { sendSuccessResponse } = require('../../utils/helpers');

const uploadImage = (string ) => {
    var base64Str = string ;
    var uploadPath = path.join(__dirname  , '../../uploads/');
    const imageName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    var optionalObj = {'fileName': imageName , 'type':'jpg'};
    return base64ToImage(base64Str , uploadPath , optionalObj); 
}

exports.createBanner = catchAsync(async(req , res ,next ) => {
    const { images } = req.body;
    if(!images){
        return next(new AppError('Images is required.' , 400))
    }
    const bannerExist = await Banner.find({ isActive : true });
    if(bannerExist.length > 0){
        return next(new AppError('Banner already exist.If you want to create new one you need to delete the previous banner.', 400))
    }
    const imagesArray = images.map(image => {
        return uploadImage(image);
    })
    const newBanner = await Banner.create({ 
        images : imagesArray 
    })
    return sendSuccessResponse(res , 201 , {
        message : 'Banner created successfully.' ,
        banner : newBanner 
    })
});

exports.getBanner = catchAsync(async(req , res ,next ) => {
    const banner = await Banner.find({ isActive : true});
    return sendSuccessResponse(res , 200 , {
        banner 
    })
});

exports.deleteBannerImage = catchAsync(async(req , res ,next ) => {
    const { id } = req.params;
    const banner = await Banner.find();
    if(!banner){
        return next(new AppError('No banner found. Please create banner first.' , 400))
    }
    const updatedBanner = await Banner.findByIdAndUpdate( banner[0]._id , {
        $pull : { images : { _id : id }}
    } , { new : true } );

    return sendSuccessResponse(res , 200 , {
        message : 'Banner image deleted successfully.', 
        banner : updatedBanner
    })
});

exports.updateBanner = catchAsync(async( req , res , next ) => {
    const { image } = req.body;
    const upadtedBanner = await Banner.findByIdAndUpdate( req.params.id , {
        $push : {
            images : uploadImage(image)
        }
    } , { new : true });

    return sendSuccessResponse(res , 200 , {
        message : 'Banner updated successfully.' , 
        banner : upadtedBanner
    })
});

exports.deleteBanner = catchAsync( async(req , res , next ) => {
    const { id } = req.params;
    await Banner.findByIdAndUpdate(id , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'Banner deleted successfully.'
    })
});