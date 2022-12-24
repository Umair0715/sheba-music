const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const User = require('../../models/userModel');
const Wallet = require('../../models/walletModel');

// 0 = guest , 1 = artist , 2 = songWriter , 3 = beatProducer , 4 = influencer
exports.getAllUsers = catchAsync(async(req , res ,next) => {
    const users = await User.find({ isAdmin : false }).select('-password');
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        results : users.length ,
        data : {
            users : users.length === 0 ? 'No user found' : users 
        }
    })
});
exports.getGuestUsers = catchAsync(async(req , res ,next ) => {
    const users = await User.find({ userType : 0 , isAdmin : false }).select('-password');
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        results : users.length ,
        data : {
            guests : users 
        }
    })
});
exports.getArtists = catchAsync(async(req , res ,next ) => {
    const artists = await User.find({ userType : 1 , isAdmin : false }).select('-password');
    return res.status(200).json({
        status : 'success' ,
        success : true , 
        results : artists.length ,
        data : {
            artists 
        }
    })
});
exports.getBeatProducers = catchAsync(async(req , res ,next ) => {
    const beatProducers = await User.find({ userType : 3 , isAdmin : false }).select('-password');
    return res.status(200).json({
        status : 'success' ,
        success : true , 
        results : beatProducers.length ,
        data : {
            beatProducers 
        }
    })
});
exports.getSongWriters = catchAsync(async(req , res ,next ) => {
    const songWriters = await User.find({ userType : 2 , isAdmin : false }).select('-password');
    return res.status(200).json({
        status : 'success' ,
        success : true , 
        results : songWriters.length ,
        data : {
            songWriters 
        }
    })
});
exports.getInfluencers = catchAsync(async(req , res ,next ) => {
    const influencers = await User.find({ userType : 4 , isAdmin : false }).select('-password');
    return res.status(200).json({
        status : 'success' ,
        success : true , 
        results : influencers.length ,
        data : {
            influencers 
        }
    })
});
exports.getUserDetails = catchAsync(async(req , res ,next ) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new AppError('User not found.' , 400))
    }
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            user 
        }
    })
})
exports.deleteUser = catchAsync(async(req , res ,next ) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new AppError('User not found.' , 404))
    }
  
    await user.delete();
    await Wallet.findOneAndUpddate({ user : req.user._id , isActive : true} , { 
        isActive : false 
    });
    return res.status(200).json({
        status : 'success' ,
        success : true ,
        data : {
            message : 'user deleted successfully.'
        }
    })
})