const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Wallet = require('../models/walletModel');
const { sendSuccessResponse } = require('../utils/helpers');


exports.createWallet = catchAsync(async ( req , res ) => {
    const walletExist = await Wallet.findOne({ user : req.user._id , isActive : true})
    if(walletExist){
        return next(new AppError('Wallet already exist.', 400))
    }
    let newWallet = await Wallet.create({ 
        user : req.user._id 
    });
    newWallet = await Wallet.findById(newWallet._id).populate('user' , 'name email phone')
    return sendSuccessResponse(res , 201 , {
        message : 'wallet created.',
        wallet : newWallet
    }) ;
});

exports.getMyWallet = catchAsync( async(req , res , next) => {
    const wallet = await Wallet.findOne({ user : req.user._id , isActive : true }).populate('user' , 'name email phone');
    return sendSuccessResponse(res , 200 , {
        wallet 
    })
});

exports.deleteWallet = catchAsync( async(req , res , next) => {
    await Wallet.findOneAndUpdate({ user : req.params.id , isActive : true } , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message : 'wallet deleted successfully.'
    })
});

exports.getSingleUserWallet = catchAsync( async(req , res , next) => {
    const wallet = await Wallet.findOne({ user : req.params.id , isActive : true }).populate('user' , 'name email phone');
    if(!wallet){
        return next(new AppError('Wallet not found.' , 404))
    }
    return sendSuccessResponse(res , 200 , {
        wallet 
    })
});