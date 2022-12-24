const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const { sendSuccessResponse , uploadImage } = require('../utils/helpers')


exports.getProfile = catchAsync(async(req , res, next) => {
    const user = await User.findById(req.user._id);
    if(!user){
        return next(new AppError('User not found.' , 404))
    }
    user.password = '';
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            user 
        }
    })
});

exports.changePassword = catchAsync(async(req , res , next) => {
    const { oldPassword , newPassword , confirmPassword } = req.body;
    if(!oldPassword || !newPassword || !confirmPassword){
        return next(new AppError('Missing required credentials.' , 400))
    }
    const user = await User.findById(req.user._id);
    if(!user) return next(new AppError('This user does not exist.' , 404))
    const match = await user.comparePassword(oldPassword);
    if(!match){
        return next(new AppError('Incorrent old password.' , 400))
    }
    if(newPassword !== confirmPassword){
        return next(new AppError('New password does not match with Confirm password.' , 400))
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            message : 'Password changed successfully'
        }
    })
});

exports.updateUser = catchAsync(async(req , res , next) => {
    const user = await User.findByIdAndUpdate(req.user._id , req.body , {
        new : true 
    });
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            user 
        }
    });
});

exports.deleteMyAccount = catchAsync(async(req , res , next) => {
    await User.findByIdAndUpdate(req.user._id , { isActive : false } );
    return sendSuccessResponse(res , 200 , {
        message : 'User deleted successfully.'
    });
});


exports.changeProfileImage = catchAsync( async(req , res , next) => {
    let { profileImage } = req.body;
    profileImage = uploadImage(profileImage , 'profilePictures');
    let updatedUser = await User.findByIdAndUpdate(req.user._id , { profileImage } , { 
        new : true ,
        runValidators : true 
    });
    return sendSuccessResponse(res , 200 , {
        user : updatedUser
    })
});

exports.changeCoverImage = catchAsync( async(req , res , next) => {
    let { coverImage } = req.body;
    coverImage = uploadImage(coverImage , 'coverImages');
    let updatedUser = await User.findByIdAndUpdate(req.user._id , { coverImage } , {
        new : true ,
        runValidators : true
    });
    return sendSuccessResponse(res , 200 , {
        user : updatedUser
    })
});


exports.setFcmToken = catchAsync(async( req , res , next ) => {
    const { fcmToken } = req.body;
    if(!fcmToken){
        return next(new AppError('Please provide fcmToken.' , 400))
    }
    await User.findByIdAndUpdate(req.user._id , { fcmToken } );
    return sendSuccessResponse(res , 200 , { message : 'fcmToken updated.'})
});

