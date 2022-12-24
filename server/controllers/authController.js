const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { OAuth2Client } =  require("google-auth-library");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendEmail } = require('../utils/email');
const Facebook = require('facebook-node-sdk');
const totp = require('totp-generator');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const Wallet = require('../models/walletModel');
const { sendSuccessResponse , sendErrorResponse , generateToken , sendCookie , signToken } = require('../utils/helpers');
const Notification = require('../models/notificationModel');


let facebook = new Facebook({ 
    appID: process.env.FACEBOOK_APP_ID , 
    secret: process.env.FACEBOOK_APP_SECRET 
});


const createUserWallet = async ( res , id) => {
    try {
        await Wallet.create({ 
            user : id
        });
    } catch (error) {
        console.log('AuthController Create Wallet error' , error)
        return sendSuccessResponse(res , 500 , {
            message : 'Internal server error.'
        })
    }
}

exports.googleLogin = catchAsync(async (req, res) => {
    const { idToken } = req.body;
  
    const response = await client.verifyIdToken({ 
        idToken , audience: process.env.GOOGLE_CLIENT_ID 
    })
    const { email_verified , name, email } = response.payload;

    if(email_verified){
        const user = await User.findOne({ email });
        if(user){
            const token = signToken({ _id : user._id });
            return res.status(200).json({
                status : 'success' ,
                success : true ,
                data : {
                    user , 
                    token 
                }
            })
        }else{
            const newUser = await User.create({
                name , 
                email , 
                accountType : 'google',
                userType : req.body.userType ? req.body.userType : 'guest' ,
                password : email + process.env.JWT_SECRET ,
                emailVerified : true 
            })
            const token = signToken({ _id : newUser._id });
            res.status(200).json({
                status : 'success' ,
                success : true ,
                data : {
                    user : newUser ,
                    token 
                }
            })
        }
    }else{
        return next(new AppError('Google login error. please try again.' , 400))
    }
});

exports.facebookLogin = catchAsync( async( req , res , next ) => {
    const { userID , accessToken } = req.body;
    console.log('body' , req.body);
  
    facebook.api(url, function(err, data){
        if(err){
            console.error(err);
           return res.status(500).json({
                message : err.message
           })
        }
        else{
            console.log('data' , data)
            res.send('done')
        }
    });
    
});

exports.register = catchAsync( async (req , res , next) => {
    const { name , email , password , country , state , city , phone  } = req.body;
    if(!name || !email || !password || !country || !state || !city || !phone){
        return next(new AppError('Missing required credentials.' , 400))
    }
    const user = await User.findOne({ email });
    if(user){
        return next(new AppError('Email is already taken.' , 400))
    }
    const verificationToken = generateToken(name , email);

    const newUser = await User.create({
        name , email , password , country , state , city , phone ,
        userType : req.body.userType ? req.body.userType : 0 ,
        verificationToken 
    });
    await createUserWallet(res , newUser._id) 
    await Notification.create({ user : newUser._id });
    try {
        const newToken = signToken({ _id : newUser._id });
        await sendEmail(email , 'Email Verification' , `Your email verification code ${verificationToken} `);
        sendCookie(res , newToken)
        return sendSuccessResponse(res , 201 , {
            message : `Email sent to ${email}. Please verify your email address` , 
            user : newUser ,
            token : newToken
        })
    } catch (error) {
        console.log('mail error' , error)
        return sendErrorResponse(res , 500 , {
            message : 'Something went wrong.Please try again.'
        })
    }  
});

exports.login = catchAsync( async( req , res , next) => {
    const { email , password } = req.body;
    if(!email || !password){
        return next(new AppError('Missing required credentials.' , 400))
    }
    const user = await User.findOne({ email });
    if(!user || !(await user.comparePassword(password))){
        return next(new AppError('Wrong email or password.' , 400))
    }
    const token = signToken({ _id : user._id});
    sendCookie(res , token)
    user.password = '';
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            user ,
            token 
        }
    })
});

exports.verifyEmail = catchAsync( async(req , res ,next ) => {
    const { token } = req.body;
    if(!token){
        return next(new AppError('Invalid request. Missing required credentials.' , 400));
    }
    const user = await User.findById(req.user_id)
    if(!user){
        return next(new AppError('Email verification failed.' , 400))
    }
    if(user.verificationToken !== token){ 
        return next(new AppError('Email verfication failed.' , 400));
    }
    if(user.emailVerified){
        return res.status(200).json({
            status : 'success' ,
            success : true ,
            data : {
                message : 'This email is alredy verified.'
            }
        })
    }
    user.emailVerified = true ;
    user.verificationToken = '';
    await user.save();
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            message : 'Email verified successfully.'
        }
    })
});

exports.sendOtp = catchAsync( async(req ,res ,next) => {
    const response = await twilioClient.verify.v2.services(process.env.VERIFY_SERVICE_SID)
    .verifications
    .create({to: req.body.phoneNumber , channel: 'sms'})
    console.log(response);
    
    res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            message : 'Please check your phone number.'
        }
    })
    
});

exports.verifyOtp = catchAsync( async(req , res , next) => {
    const result = await twilioClient.verify.v2.services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks
    .create({to: req.body.phoneNumber, code: req.body.otp})

    if(result.valid){
        res.status(200).json({
            status : 'success',
            success : true ,
            data : {
                message : 'Phone number verified.'
            }
        });
    }else{
        res.status(400).json({
            status : 'failed',
            success : false,
            data : {
                message : 'Invalid verification code.'
            }
        })
    }
});

exports.resetPassword = catchAsync(async(req , res , next) => {
    const { newPassword , email } = req.body;
    if(!newPassword){
        return next(new AppError("Please provide your new password." , 400))
    }
    const user = await User.findOne({ email });
    if(!user){
        return next(new AppError('Received wrong credentials.' , 404))
    }
    user.password = newPassword;
    await user.save();   
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            message : 'Password updated successfully.'
        }
    })
});

exports.phoneLogin = catchAsync( async(req , res, next) => {
    const result = await twilioClient.verify.v2.services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks
    .create({to: req.body.phoneNumber, code: req.body.otp})

    if(result.valid){
        const user = await User.findOne({ phone : req.body.phoneNumber});
        if(user){
            const token = signToken({ _id : user._id });
            sendCookie(res , token)
            return res.status(200).json({
                status : 'success' ,
                success : true ,
                new : false , 
                data : {
                    user ,
                    token
                }
            })
        }else{
            const newUser = await User.create({
                phone : req.body.phoneNumber ,
                accountType : 'phone' ,
                phoneVerified : true ,
                userType : req.body.userType ? req.body.userType : 0
            });
            const token = signToken({ _id : newUser._id });
            sendCookie(res , token)
            return res.status(201).json({
                status : 'success' ,
                success : true ,
                new : true ,
                data : {
                    user : newUser ,
                    token 
                }
            });
        }
    }else{
        res.status(400).json({
            status : 'failed',
            success : false,
            data : {
                message : 'Invalid verification code.'
            }
        })
    }
});

exports.sendForgotPasswordEmail = catchAsync( async(req , res , next) => {
    const { email } = req.body;
    if(!email){
        return next(new AppError('Please provide your email address.' , 400))
    }
    const user = await User.findOne({ email });
    if(!user){
        return next(new AppError('Email is not registered.' , 400));
    }
    const token = generateToken(user.name , user.email);
    try {
        await sendEmail(email , 'Forgot Password Request' , `Your verification code ${token} `);
        user.passwordResetToken = token;
        await user.save();
        return res.status(200).json({
            status  : 'success' ,
            success : true ,
            data : {
                message : `Email sent to ${email}`
            }
        })
    } catch (error) {
        console.log('forgot password email sending error' , error );
        return res.json({
            status : 'error' ,
            success : false ,
            data : {
                message : 'Internal server error'
            }
        })
    }

});

exports.verifyForgotEmail = catchAsync( async(req , res , next) => {
    const { email , token } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        return next(new AppError('received wrong credentials.' ,400))
    }
    if(user.passwordResetToken !== token){
        return next(new AppError('Verification failed.' , 400))
    }
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            message : 'Verification completed.'
        }
    })
})

exports.logout = (req , res , next) =>{
    res.cookie('token' , 'loggedOut' , {
        expires : new Date(Date.now() + 10 * 1000), 
        httpOnly : true 
    });

    res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            message : 'Logged out successfully.',
            token : 'logout'
        }
    })
}

// exports.verifyPhoneNumber = catchAsync( async(req , res , next ) => {
//     try {
//         const result = await twilioClient.verify.v2.services(process.env.VERIFY_SERVICE_SID)
//         .verificationChecks
//         .create({to: req.body.phoneNumber, code: req.body.otp})
    
//         if(result.valid){
//             const user = await User.findById(req.user._id);
//             if(user.phoneVerified){
//                 return res.status(200).json({
//                     status :'success' ,
//                     success : true ,
//                     data : {
//                         message : "You already have verified phone number."
//                     }
//                 })
//             }
//             user.phone = req.body.phoneNumber;
//             user.phoneVerified = true;
//             await user.save();
//             res.status(200).json({
//                 status : 'success',
//                 success : true ,
//                 data : {
//                     message : 'Phone number verified.'
//                 }
//             });
//         }else{
//             res.status(400).json({
//                 status : 'failed',
//                 success : false,
//                 data : {
//                     message : 'Invalid verification code.'
//                 }
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             status : 'error' ,
//             success : false ,
//             data : {
//                 message : 'Something went wrong.'
//             }
//         })
//     }
// })

