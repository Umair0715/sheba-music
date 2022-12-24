const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const AdminCommission = require('../../models/commissionModel');
const { sendSuccessResponse } = require('../../utils/helpers');


exports.createCommission = catchAsync( async( req , res , next ) => {
    const { commissionType , commission } = req.body;
    if(commissionType === undefined  || !commission ){
        return next(new AppError('CommissionType and Commission is required.' , 400))
    }
    const commissionExist = await AdminCommission.findOne({ commissionType , commission , isAcitve : true });
    if(commissionExist){
        return next(new AppError('This commission type already created.' , 400))
    }
    const newCommission = await AdminCommission.create({ commissionType , commission });
    return sendSuccessResponse(res , 201 , {
        data : newCommission 
    })
});


exports.getCommissionList = catchAsync( async( req , res , next ) => {
    const commissionsList = await AdminCommission.find();
    return sendSuccessResponse(res , 200 , {
        data : commissionsList 
    })
});

exports.updateCommission = catchAsync( async(req , res , next ) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError('Please provide Commission id to update.', 400))
    }
    const updatedCommission = await AdminCommission.findByIdAndUpdate(id , req.body , { 
        new : true ,
        runValidators : true
    });
    return sendSuccessResponse(res , 200 , {
        data : updatedCommission
    })
});