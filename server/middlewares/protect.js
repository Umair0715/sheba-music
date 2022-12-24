const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

exports.protect = catchAsync(async(req ,res , next) => {
   let token ;
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];
   }else{
      token = req.cookies.token;
   }
   if(!token){
      return next(new AppError("you're not logged in. please login to get access" , 400))
   }
   const decoded = jwt.verify(token , process.env.JWT_SECRET);
   const { _id } = decoded ;
   const user = await User.findById(_id);
   if(!user){
      return next(new AppError('You are not a registered User. please register your account.' , 400));
   }
   req.user = user;
   next();
})

exports.isAdmin = (req , res , next) => {
   if(req.user.userType === 5){
      return next();
   }
   return next(new AppError('Only admin can perform this action.'))
};

exports.restrictTo = (...roles) =>{
   return (req , res, next) =>{
      if(!roles.includes(req.user.userType)){
         return next(new AppError('you do not have permission to perform this action' , 403));
      }
      next();
   }
}