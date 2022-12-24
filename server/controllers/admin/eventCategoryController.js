const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const EventsCategory = require('../../models/EventCategoryModel');
const { sendSuccessResponse } = require('../../utils/helpers');

exports.createEventCategory = catchAsync(async(req , res ,next ) => {
    const { name } = req.body;
    if(!name){
        return next(new AppError('Please provide category name' , 400))
    }
    const categoryExist = await EventsCategory.findOne({ name , isActive : true });
    if(categoryExist){
        return next(new AppError('Category name already exist' , 400))
    }
    let newCategory = await EventsCategory.create({ 
        name , 
        user : req.user._id 
    });
    newCategory = await newCategory.populate('user' , 'name email phone');

    return sendSuccessResponse(res , 201 , {
        message : 'Category created.', 
        category : newCategory
    })
});

exports.getEventsCategories = catchAsync( async(req , res , next ) => {
    const categories = await EventsCategory.find({ isActive : true })
    .populate('user' , 'name email phone');
    return sendSuccessResponse(res , 200 , {
        categories 
    })
});

exports.updateEventCategory = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    if(!id){
        return next(new App('Please provide category id' , 400))
    }
    const updatedCategory = await EventsCategory.findByIdAndUpdate( id , req.body , {
        new : true ,
        runValidators : true
    }).populate({
        path : 'user' , 
        select : "name email phone"
    });

    return sendSuccessResponse(res , 200 , {
        message : 'Category updated successfully.', 
        category : updatedCategory
    })
});

exports.deleteEventCategory = catchAsync( async(req , res , next ) => {
    const { id } = req.params;
    if(!id){
        return next(new App('Please provide category id' , 400))
    };

    await EventsCategory.findByIdAndUpdate(id , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'Event category deleted.'
    })
});

exports.getSingleEventCategory = catchAsync( async(req , res , next ) => {
    const { id } = req.params;
    const category = await EventsCategory.findOne({ _id : id , isActive : true })
    .populate('user' , 'name email phone');
    return sendSuccessResponse(res , 200 , {
        eventCategory : category 
    })
})