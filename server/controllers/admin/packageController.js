const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Package = require('../../models/packageModel');
const { sendSuccessResponse } = require('../../utils/helpers');


exports.createPackage = catchAsync( async ( req , res , next ) => {
    const { name , shortDescription , price , duration , features } = req.body;
    if(!name || !shortDescription || !price || !duration || !features ){
        return next(new AppError('Missing required credentials.' , 400));
    }
    const newPackage = await Package.create({
        name , shortDescription , price , duration , features
    });
    return sendSuccessResponse(res , 201 , { 
        message : 'Package created successfully.', 
        package : newPackage
    })
});

exports.getAllPackages = catchAsync( async ( req , res ) => {
    const packages = await Package.find({ isActive : true })
    .sort({ createdAt : '-1'});
    return sendSuccessResponse(res , 200 , { packages })
});

exports.getSinglePackage = catchAsync( async ( req , res ) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError('Plase provide package id.' , 400))
    }
    const package = await Package.findById(id);
    return sendSuccessResponse(res , 200 , { package })
});


exports.updatePackage = catchAsync( async ( req , res ) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError('Plase provide package id.' , 400))
    }
    const updatedPackage = await Package.findByIdAndUpdate(id , req.body , {
        new : true , runValidators : true
    });
    return sendSuccessResponse(res , 200 , { package : updatedPackage })
});


exports.deletePackage = catchAsync( async ( req , res ) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError('Plase provide package id.' , 400))
    }
    await Package.findByIdAndUpdate(id , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'Package deleted successfully.'
    })
});