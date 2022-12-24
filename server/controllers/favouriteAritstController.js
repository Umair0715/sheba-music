const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const FavouriteArtist = require('../models/favouriteArtistModel');
const { sendSuccessResponse } = require('../utils/helpers');

exports.addFavouriteAritsts = catchAsync( async(req , res , next) => {
    const { artists } = req.body;
    const newFavouriteArtists = await FavouriteArtist.create({
        user : req.user._id , 
        artists
    });
    const favouriteArtists = await FavouriteArtist.findById(newFavouriteArtists._id)
    .populate({
        path : 'artists' , 
        populate : {
            path : 'artistId',
            select : 'name email phone'
        }
    })
    return sendSuccessResponse(res , 201 , {
        favouriteArtists 
    })
});



exports.getMyFavouriteArtists = catchAsync( async(req , res , next) => {
    const favouriteArtists = await FavouriteArtist.findOne({ user : req.user._id })
    .populate('user' , 'name email phone')
    .populate({
        path : 'artists' , 
        populate : {
            path : 'artistId',
            select : 'name email phone'
        }
    });
    return sendSuccessResponse(res , 201 , {
        favouriteArtists 
    })
});


exports.updateFavouriteArtists = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    const favouriteArtists = await FavouriteArtist.findByIdAndUpdate(id , req.body , {
        new : true , 
        runValidators : true
    })
    .populate('user' , 'name email phone')
    .populate({
        path : 'artists' , 
        populate : {
            path : 'artistId',
            select : 'name email phone'
        }
    });
    return sendSuccessResponse(res , 200 , {
        favouriteArtists
    })
});