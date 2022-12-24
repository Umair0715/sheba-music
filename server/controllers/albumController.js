const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Album = require('../models/albumModel');
const { sendSuccessResponse , uploadImage  } = require('../utils/helpers');
const AlbumItems = require('../models/albumItemsModel');
const Song = require('../models/songModel');
const Beat = require('../models/beatModel');


exports.createAlbum = catchAsync(async ( req , res , next ) => {
    const { name , image , items } = req.body;
    if(!name || !image){
        return next(new AppError('Missing required credentials.' , 400))
    };
   
    let newAlbum ;
    if(items.length > 0){
        if(items.length > 20 ) return next(new AppError('Limit error.You can add 20 items in one album.' , 400));

        req.body.image = uploadImage(image , 'albums');
        req.body.albumCreator = req.user._id;
        req.body.itemsCount = items.length;
        newAlbum = await Album.create(req.body);

        for (let item of items ) {
            await AlbumItems.create({
                item : item.id ,
                type : item.type , // 1 = song , 2 = beat 
                album : newAlbum._id 
            })
        }
        
    }
    newAlbum = await Album.findById(newAlbum._id).populate({
        path : 'albumCreator' ,
        select : 'name email phone' 
    })
    return sendSuccessResponse(res , 201 , {
        message : 'New album created.', 
        album : newAlbum
    });
});

// /api/album => GET => protected 
exports.getMyAlbums = catchAsync( async ( req , res , next ) => {
    const pageSize = 10 ;
    const page = Number(req.query.page) || 1;
    const albums = await Album.find({ user : req.user._id , isActive : true }).populate('albumCreator' , 'name email phone')
    .limit(pageSize).skip(pageSize * (page - 1));
    const docCount = await Album.countDocuments({ user : req.user._id , isActive : true });
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse(res , 200 , {
        albums , page , pages , docCount  
    });
});

// /api/album/:id => PUT => protected 
exports.updateAlbum = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    const updatedAlbum = await Album.findByIdAndUpdate(id , req.body , {
        new : true ,
        runValidators : true 
    }).populate('albumCreator' , 'name email phone');

    return sendSuccessResponse(res , 200 , {
        album : updatedAlbum
    })
});

// /api/album/:id => DELETE => protected
exports.deleteAlbum = catchAsync( async ( req , res , next ) => {
    const { id } = req.params;
    await Album.findByIdAndUpdate(id , {
        isActive : false 
    } , { new : true });
    return sendSuccessResponse(res , 200 , {
        message : 'Album deleted.'
    })
});


exports.getAllAlbums = catchAsync(async ( req , res , next) => {
    const pageSize = 10 ;
    const page = Number(req.query.page) || 1;
    const albums = await Album.find({ isActive : true })
    .limit(pageSize).skip(pageSize * (page - 1 ))
    .populate('albumCreator' , 'name email phone')
    const docCount = await Album.countDocuments(({ isActive : true }))
    const pages = Math.ceil(docCount/pageSize);
    return sendSuccessResponse( res , 200 , {
        albums , page , pages , docCount 
    });
});

exports.getSingleAlbum = catchAsync( async ( req , res , next ) => {
    const { id } = req.params;
    const album = await Album.findOne({ _id : id , isActive : true })
    .populate('albumCreator' , 'name email phone')
    return sendSuccessResponse(res , 200 , {
        album 
    })
});

exports.changeAlbumImage = catchAsync(async(req , res , next) => {
    let { image } = req.body;
    image = uploadImage(image , 'albums');
    let updatedAlbum = await Album.findByIdAndUpdate(req.params.id , { image } , {
        new : true ,
        runValidators : true 
    });
    return sendSuccessResponse(res , 200 , {
        album : updatedAlbum
    })
});


// AlbumItems Model Code 
exports.addItemsInAlbum = catchAsync( async ( req , res , next ) => {
    const { items } = req.body;
    const { id } = req.params;
    const album = await Album.findById(id);
    if(!album){
        return next(new AppError('Album not found.' , 400))
    }
    const totalItems = items.length + album.itemsCount;
    if(album.itemsCount >= 20 || totalItems > 20){
        return next(new AppError('You can add only 20 items in one album.' , 400))
    }   
    for (let item of items){
        await AlbumItems.create({ 
            album : album._id ,
            type : item.type , 
            item : item.id 
        })
    }
    album.itemsCount += items.length;
    await album.save();

    return sendSuccessResponse(res , 200 , {
        message : 'Items added.' ,
    }); 
});

exports.deleteAlbumItem = catchAsync( async ( req , res ) => {
    const { albumId , itemId } = req.params;
    const album = await Album.findById(albumId);
    album.itemsCount -= 1;
    await album.save();
    await AlbumItems.findByIdAndRemove(itemId);
    return sendSuccessResponse(res , 200 , {
        message : 'Item removed from album.'
    });
});

exports.getAlbumSongsAndBeats = catchAsync(async(req , res ,next) => {
    let albumSongs = await AlbumItems.find({ album : req.params.albumId , isActive : true , type : 1 })
    .limit(5);
    albumSongs = await Promise.all(albumSongs.map( async song => await Song.findById(song.item)));
    let albumBeats = await AlbumItems.find({ album : req.params.albumId , isActive : true , type : 2 })
    .limit(5);
    albumBeats = await Promise.all(albumBeats.map(async beat => await Beat.findById(beat.item)))
    
    return sendSuccessResponse(res , 200 , { 
        albumSongs , albumBeats
     })
});

exports.getAlbumSongs = catchAsync(async(req , res , next ) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    let albumSongs = await AlbumItems.find({ album : req.params.albumId , isActive : true , type : 1 })
    .limit(pageSize).skip(pageSize * (page - 1))
    const docCount = await AlbumItems.countDocuments({ album : req.params.albumId , isActive : true , type : 1 });
    const pages = Math.ceil(docCount/pageSize);
    albumSongs = await Promise.all(albumSongs.map(async song => await Song.findById(song.item)));
    return sendSuccessResponse(res , 200 , {
        page , pages , docCount , albumSongs 
    })
});


exports.getAlbumBeats = catchAsync(async(req , res , next ) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    let albumBeats = await AlbumItems.find({ album : req.params.albumId , isActive : true , type : 2 })
    .limit(pageSize).skip(pageSize * (page - 1))
    const docCount = await AlbumItems.countDocuments({ album : req.params.albumId , isActive : true , type : 2 });
    const pages = Math.ceil(docCount/pageSize);
    albumBeats = await Promise.all(albumBeats.map(async beat => await Beat.findById(beat.item)));
    return sendSuccessResponse(res , 200 , {
        page , pages , docCount , albumBeats 
    })
});





exports.deleteAllAlbums = async (req ,res) => {
    const albums = await Album.find();
    for (let album of albums) {
        await Album.findByIdAndRemove(album._id);
    }
    res.json({ msg : 'done'})
}







// /api/album => POST => protected
// exports.createAlbum = catchAsync(async ( req , res , next ) => {
//     const { name , image } = req.body;
//     if(!name || !image){
//         return next(new AppError('Missing required credentials.' , 400))
//     };
//     const uploadedImage = uploadImage(image , 'albums');
//     req.body.image = uploadedImage;
//     req.body.albumCreator = req.user._id;

//     let newAlbum = await Album.create(req.body);
//     newAlbum = await Album.findById(newAlbum._id).populate({
//         path : 'albumCreator' ,
//         select : 'name email phone' 
//     }).populate({
//         path : 'songs',
//         populate : {
//             path : 'song' ,
//             select : '-__v',
//             populate : {
//                 path : 'songCreator',
//                 select : 'name email phone'
//             }
//         }
//     });
  
//     return sendSuccessResponse(res , 201 , {
//         message : 'New album created.', 
//         album : newAlbum
//     });
// });

// // /api/album => GET => protected 
// exports.getMyAlbums = catchAsync( async ( req , res , next ) => {
//     const albums = await Album.find({ user : req.user._id , isActive : true }).populate('albumCreator' , 'name email phone').populate({
//         path : 'songs',
//         populate : {
//             path : 'song' ,
//             select : 'title audio category songCover songCreator',
//             populate : {
//                 path : 'songCreator',
//                 select : 'name email phone'
//             }
//         }
//     });
//     return sendSuccessResponse(res , 200 , {
//         albums 
//     });
// });

// // /api/album/:id => PUT => protected 
// exports.updateAlbum = catchAsync( async(req , res , next) => {
//     const { id } = req.params;
//     const updatedAlbum = await Album.findByIdAndUpdate(id , req.body , {
//         new : true ,
//         runValidators : true 
//     }).populate('albumCreator' , 'name email phone').populate({
//         path : 'songs',
//         populate : {
//             path : 'song' ,
//             select : 'title audio category songCover songCreator' ,
//             populate : {
//                 path : 'songCreator',
//                 select : 'name email phone'
//             }
//         }
//     });
//     return sendSuccessResponse(res , 200 , {
//         album : updatedAlbum
//     })
// });

// // /api/album/:id => DELETE => protected
// exports.deleteAlbum = catchAsync( async ( req , res , next ) => {
//     const { id } = req.params;
//     await Album.findByIdAndUpdate(id , {
//         isActive : false 
//     } , { new : true });
//     return sendSuccessResponse(res , 200 , {
//         message : 'Album deleted.'
//     })
// });

// // /api/album/:id => PUT => protected
// exports.addSongsInAlbum = catchAsync( async ( req , res , next ) => {
//     const { songs } = req.body;
//     let updatedAlbum = await Album.findByIdAndUpdate(req.params.id , {
//         $addToSet  : {  songs : songs } 
//     } , { new : true });

//     updatedAlbum = await Album.findById(updatedAlbum._id).populate('albumCreator' , 'name email phone')
//     .populate({
//         path : 'songs' ,
//         populate : {
//             path : 'song' , 
//             select : '-__v' ,
//             populate : {
//                 path : "songCreator",
//                 select : "name email phone"
//             }
//         }
//     });

//     return sendSuccessResponse(res , 200 , {
//         message : 'Album updated.' ,
//         album : updatedAlbum
//     }); 
// });

// exports.getAllAlbums = catchAsync(async ( req , res , next) => {
//     const pageSize = 10 ;
//     const page = Number(req.query.page) || 1;
//     const albums = await Album.find()
//     .limit(pageSize).skip(pageSize * (page - 1 ))
//     .populate('albumCreator' , 'name email phone')
//     .populate({
//         path : 'songs',
//         populate : {
//             path : 'song' ,
//             select : '-__v' ,
//             populate : {
//                 path : 'songCreator',
//                 select : 'name email phone'
//             }
//         } 
//     });
    
    
//     return sendSuccessResponse( res , 200 , {
//         albums 
//     });
// });

// exports.getSingleAlbum = catchAsync( async ( req , res , next ) => {
//     const { id } = req.params;
//     const album = await Album.findOne({ _id : id , isActive : true })
//     .populate('albumCreator' , 'name email phone')
//     .populate({
//         path : 'songs',
//         populate : {
//             path : 'song' ,
//             select : '-__v' ,
//             populate : {
//                 path : 'songCreator',
//                 select : 'name email phone'
//             }
//         } 
//     });
//     return sendSuccessResponse(res , 200 , {
//         album 
//     })

// });

// exports.deleteAlbumSong = catchAsync( async ( req , res ) => {
//     const { albumId , songId } = req.params;
//     const album = await Album.findById(albumId);
//     album.songs = album.songs.filter(song => song.song.toString() !== songId.toString() );
//     await album.save();
//     return sendSuccessResponse(res , 200 , {
//         message : 'Song delete successfully.'
//     });
// });

// exports.changeAlbumImage = catchAsync(async(req , res , next) => {
//     let { image } = req.body;
//     image = uploadImage(image , 'albums');
//     let updatedAlbum = await Album.findByIdAndUpdate(req.params.id , { image } , {
//         new : true ,
//         runValidators : true 
//     });
//     return sendSuccessResponse(res , 200 , {
//         album : updatedAlbum
//     })
// }); 