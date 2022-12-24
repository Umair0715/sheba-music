const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Playlist = require('../models/playlistModel');
const { sendSuccessResponse , uploadImage } = require('../utils/helpers');

// /api/playlist => POST => protected
exports.createPlaylist = catchAsync(async ( req , res , next ) => {
    const { name , image } = req.body;
    if(!name || !image){
        return next(new AppError('Missing required credentials.' , 400))
    };
    const uploadedImage = uploadImage(image , 'playlists');
    req.body.image = uploadedImage;
    req.body.playlistCreator = req.user._id;

    let newPlaylist = await Playlist.create(req.body);
    newPlaylist = await Playlist.findById(newPlaylist._id).populate({
        path : 'playlistCreator' ,
        select : 'name email phone' 
    }).populate({
        path : 'songs',
        populate : {
            path : 'song' ,
            select : '-__v',
            populate : {
                path : 'songCreator',
                select : 'name email phone'
            }
        }
    });
  
    return sendSuccessResponse(res , 201 , {
        message : 'New playlist created.', 
        playlist : newPlaylist
    });
});

// /api/playlist => GET => protected 
exports.getMyPlaylists = catchAsync( async ( req , res , next ) => {
    const playlists = await Playlist.find({ user : req.user._id , isActive : true }).populate('playlistCreator' , 'name email phone').populate({
        path : 'songs',
        populate : {
            path : 'song' ,
            select : 'title audio category songCover songCreator',
            populate : {
                path : 'songCreator',
                select : 'name email phone'
            } ,
            populate : {
                path : 'category' ,
                select : 'name' ,
                populate : {
                    path : 'parentId',
                    select : 'name' ,
                }
            }
        }
    });
    return sendSuccessResponse(res , 200 , {
        playlists 
    });
});

// /api/playlist/:id => PUT => protected 
exports.updatePlaylist = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    const updatedPlaylist = await Playlist.findByIdAndUpdate(id , req.body , {
        new : true ,
        runValidators : true 
    }).populate('playlistCreator' , 'name email phone').populate({
        path : 'songs',
        populate : {
            path : 'song' ,
            select : 'title audio category songCover songCreator' ,
            populate : {
                path : 'songCreator',
                select : 'name email phone'
            } ,
            populate : {
                path : 'category' ,
                select : 'name' ,
                populate : {
                    path : 'parentId',
                    select : 'name' ,
                }
            }
        }
    });
    return sendSuccessResponse(res , 200 , {
        playlist : updatedPlaylist
    })
});


// /api/playlist/:id => DELETE => protected
exports.deletePlaylist = catchAsync( async ( req , res , next ) => {
    const { id } = req.params;
    await Playlist.findByIdAndUpdate(id , {
        isActive : false 
    } , { new : true });
    return sendSuccessResponse(res , 200 , {
        message : 'Playlist deleted.'
    })
});


// /api/playlist/addSongs/:id => PUT => protected
exports.addSongsInPlaylist = catchAsync( async ( req , res , next ) => {
    const { songs } = req.body;
    let updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id , {
           $addToSet  : {  songs : songs } 
    } , { new : true });
    
    updatedPlaylist = await Playlist.findById(updatedPlaylist._id).populate('playlistCreator' , 'name email phone')
    .populate({
        path : 'songs' ,
        populate : {
            path : 'song' , 
            select : '-__v' ,
            populate : {
                path : "songCreator",
                select : "name email phone"
            } ,
            populate : {
                path : 'category' ,
                select : 'name' ,
                populate : {
                    path : 'parentId',
                    select : 'name' ,
                }
            }
        }
    });

    return sendSuccessResponse(res , 200 , {
        message : 'Playlist updated.' ,
        playlist : updatedPlaylist
    })
    
});


exports.getAllPlaylists = catchAsync( async(req , res , next) => {
    const pageSize = 10 ;
    const page = Number(req.query.page) || 1;
    const playlists = await Playlist.find({ isActive : true }).limit(pageSize)
    .skip(pageSize * (page - 1 ))
    .populate('playlistCreator' , 'name email phone').populate({
        path : 'songs',
        populate : {
            path : 'song' ,
            select : 'title audio category songCover songCreator',
            populate : {
                path : 'songCreator',
                select : 'name email phone'
            } , 
            populate : {
                path : 'category' ,
                select : 'name' ,
                populate : {
                    path : 'parentId',
                    select : 'name' ,
                }
            }
        }
    });

    return sendSuccessResponse(res , 200 , {
        playlists
    })

});

exports.getSinglePlaylist = catchAsync( async ( req , res , next ) => {
    const { id } = req.params;
    const playlist = await Playlist.findById(id)
    .populate('playlistCreator' , 'name email phone').populate({
        path : 'songs',
        populate : {
            path : 'song' ,
            select : 'title audio category songCover songCreator',
            populate : {
                path : 'songCreator',
                select : 'name email phone'
            } , 
            populate : {
                path : 'category' ,
                select : 'name' ,
                populate : {
                    path : 'parentId',
                    select : 'name' ,
                }
            }
        }
    });
    return sendSuccessResponse(res , 200 , { 
        playlist 
    })
});

exports.changePlaylistImage = catchAsync(async(req , res , next) => {
    let { image } = req.body;
    image = uploadImage(image , 'playlists');
    let updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id , { image } , {
        new : true ,
        runValidators : true 
    });
    return sendSuccessResponse(res , 200 , {
        playlist : updatedPlaylist
    })
}); 