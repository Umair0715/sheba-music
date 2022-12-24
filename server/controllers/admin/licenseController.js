const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const License = require('../../models/licenseModel');
const { sendSuccessResponse } = require('../../utils/helpers');


exports.createLicense = catchAsync(async(req , res ,next ) => {
    console.log(req.body);
    const { name , price } = req.body;
    if(!name || !price){
        return next(new AppError('Please provide both license name and price.' , 400))
    } 
    const licenseExist = await License.findOne({ name });
    if(licenseExist && licenseExist.isActive){
        return next(new AppError('This License is already exist.' , 400))
    }
    const newLicense = await License.create({ 
        name , price , user : req.user._id
    });
    return sendSuccessResponse(res , 201 , {
        message : 'New license created.',
        license : newLicense
    })
});

exports.updateLicense = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError('Please provide license id.' , 400))
    }
    const updatedLicense = await License.findByIdAndUpdate(id , req.body , {
        new : true , 
        runValidators : true 
    }).populate("user" , 'name email phone');
    return sendSuccessResponse(res , 200 , {
        message : "License updated.", 
        license : updatedLicense
    })
});

exports.getAllLicense = catchAsync( async(req , res , next ) => {
    const licenses = await License.find({ isActive : true }).populate('user' , 'name email phone');
    return sendSuccessResponse(res , 200 , {
        licenses
    })
});

exports.deleteLicense = catchAsync( async(req , res , next ) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError('Please provide license id.' , 400))
    }
    await License.findByIdAndUpdate(id , { isActive : false } );
    return sendSuccessResponse(res , 200 , {
        message : 'License deleted.'
    })
});

