const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const User = require('../../models/userModel');
const { sendSuccessResponse , signToken , sendCookie} = require('../../utils/helpers');
const Wallet = require('../../models/walletModel');

exports.registerAdmin = catchAsync(async(req , res , next ) => {
    const { name , email , password , secretKey } = req.body;
    if(!name || !email || !password || !secretKey){
        return next(new AppError('Missing required credentials.' , 400))
    }
    if(secretKey !== process.env.ADMIN_SECRET_KEY){
        return next(new AppError('UnAuthorized request' , 400))
    }
    const user = await User.findOne({ email });
    if(user){
        return next(new AppError('Email is already taken.' , 400))
    }
    const newUser = await User.create({
        name , email , password ,
        isAdmin : true 
    });
    await Wallet.create({ 
        user : newUser._id
    })
    const newToken = signToken({ _id : newUser._id });
    sendCookie(res , newToken)
    return sendSuccessResponse(res , 201 , {
        user : newUser ,
        token : newToken
    });
});


exports.loginAdmin = catchAsync( async( req , res , next) => {
    const { email , password , secretKey } = req.body;
    if(!email || !password || !secretKey){
        return next(new AppError('Missing required credentials.' , 400))
    }
    if(secretKey !== process.env.ADMIN_SECRET_KEY){
        return next(new AppError('UnAuthorized request.' , 400))
    }
    const user = await User.findOne({ email });
    if(!user || !(await user.comparePassword(password))){
        return next(new AppError('Wrong email or password.' , 400))
    }
    const token = signToken({ _id : user._id});
    sendCookie(res , token)
    user.password = '';
    return sendSuccessResponse(res , 200 , {
        user ,
        token 
    })
});