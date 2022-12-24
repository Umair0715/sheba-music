const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Category = require('../../models/categoryModel');
const { sendSuccessResponse } = require('../../utils/helpers');


exports.createCategory = catchAsync(async(req , res ,next ) => {
    const { name , type } = req.body;
    if(!name || !type){
        return next(new AppError('Please provide both category name and type.' , 400))
    }
    let newCategory = await Category.create({
        name  , type  
    });
    return sendSuccessResponse(res , 201 , {
        message : 'New Category created.' , 
        category : newCategory
    });
});

exports.getCategories = catchAsync(async(req , res ) => {
    const categories = await Category.find({ isActive : true });
    return sendSuccessResponse(res , 200 , { categories })
});

exports.updateCategory = catchAsync(async(req , res ) => {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id , req.body , {
        new : true 
    });
    return sendSuccessResponse(res , 200 , { category : updatedCategory })
});

exports.deleteCategory = catchAsync(async(req,res,next) => {
    await Category.findByIdAndUpdate( req.params.id , { isActive : false });
    return sendSuccessResponse(res , 200 , { message : 'Category removed.' })
})

exports.getSingleCategory = catchAsync( async(req , res , next ) => {
    const { id } = req.params;
    const category = await Category.findOne({ _id : id , isActive : true })
    return sendSuccessResponse(res , 200 , {
        category 
    })
});


//api/category/:id  =>  DELETE  => Admin 
// exports.deleteCategory = catchAsync(async(req , res , next ) => {
//     const { id } = req.params;
//     const category = await Category.findById(id).populate('parentId');
//     if(category.parentId){
//         category.isActive = false;
//         await category.save();
//         return sendSuccessResponse(res , 200 , { 
//             message : 'Category deleted.'
//         })
//     }else {
//         const subCategories = await Category.find({ parentId : id , isActive : true  });
//         await Promise.all(subCategories.map(async (category) => {
//             category.isActive = false ;
//             return await category.save();
//         }));
//         category.isActive = false;
//         await category.save();
//         return sendSuccessResponse( res , 200 , { 
//             message : 'Category deleted.'
//         })
//     }
// });