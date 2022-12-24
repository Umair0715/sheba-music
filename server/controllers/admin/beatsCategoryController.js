const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { sendSuccessResponse } = require('../../utils/helpers');
const BeatsCategory = require('../../models/beatsCategoryModel');


exports.createBeatCategory = catchAsync(async(req , res , next) => {
    const { name }  = req.body;
    if(!name){
        return next(new AppError('Beat category name is required.' , 400))
    }
    const newCategory = await BeatsCategory.create({ name });
    return sendSuccessResponse(res , 200 , { category : newCategory });
});

exports.getBeatCategories = catchAsync(async(req , res , next) => {
    const categories = await BeatsCategory.find({ isActive : true });
    return sendSuccessResponse(res , 200 , { categories });
});

exports.updateBeatCategory = catchAsync(async(req , res , next) => {
    const updatedBeatCategory = await BeatsCategory.findByIdAndUpdate(req.params.id , req.body , { 
        new : true , 
        runValidators : true 
    });
    return sendSuccessResponse(res ,200 , {
        message : 'Category updated.' , 
        category : updatedBeatCategory
     });
});

exports.getSingleBeatCategory = catchAsync(async(req , res , next) => {
    const category = await BeatsCategory.findOne({ _id : req.params.id , isActive : true });
    return sendSuccessResponse(res , 200 , { category })
});

exports.deleteBeatCategory = catchAsync(async(req , res , next) => {
    await BeatsCategory.findByIdAndUpdate(req.params.id , { isActive : false });
    return sendSuccessResponse(res , 200 , { message : 'Category removed. '})
});