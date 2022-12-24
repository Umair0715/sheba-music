const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Chat = require('../models/chatModel');
const { sendSuccessResponse } = require('../utils/helpers');
const User = require('../models/userModel');


exports.createChat= catchAsync(async( req , res , next) => {
    const { userId } = req.body;
    if (!userId) {
        return next(new AppError('User id is required.' , 400))
    }
    var chatExist = await Chat.findOne({ 
        users : { $all : [userId , req.user._id.toString()] } , isActive : true 
    })
    .populate("users", "name email role")
    .populate("latestMessage");
   
    chatExist = await User.populate(chatExist, {
        path: "latestMessage.sender",
        select: "name email role",
    });

    if (chatExist) {
        return sendSuccessResponse(res, 200 , { 
            chat : chatExist 
        })
    } else {
        const chatUser = await User.findById(userId).select('name');
        let newChat = await Chat.create({ 
            ...req.body ,
            users : [ userId , req.user._id ] ,
            chatName : chatUser?.name + " " + req.user.name 
        });
        newChat = await Chat.findById(newChat._id).populate(
            "users",
            "name email role"
        );
        return sendSuccessResponse(res , 201 , {
            chat : newChat 
        })
    }
});

exports.getMyChats = catchAsync(async( req , res , next) => {
    const keyword = req.query.keyword ? {
        chatName : {
            $regex : req.query.keyword ,
            $options : 'i'
        }
    } 
    : {};
    
    let chats = await Chat.find({ 
        ...keyword , users : { $in : [req.user._id] } , isActive : true 
    })
    .populate('users' , 'name email role')
    .populate({ 
        path : 'latestMessage',
        populate : { 
            path : 'sender', 
            select : 'name email role'
        }
    });

    sendSuccessResponse(res , 200 , { chats });
});


exports.deleteChat = catchAsync(async(req ,res, next) => {
    const { chatId } = req.params;
    if(!chatId){
        return next(new AppError('Chat id is required.' , 400))
    }
    await Chat.findByIdAndUpdate(chatId , { isActive : false } );
    return sendSuccessResponse(res , 200 , { 
        message : 'Chat deleted successfully.'
    });
});

exports.getSingleChat = catchAsync(async (req , res , next) => {
    const { userId } = req.body;
    if (!userId) {
        return next(new AppError('User id is required.' , 400))
    }
    var chat = await Chat.findOne({ 
        users : { $all : [userId , req.user._id.toString()] } , isActive : true 
    })
    .populate("users", "name email role")
    .populate("latestMessage");
   
    chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name email role",
    });
   
    return sendSuccessResponse(res, 200 , { 
        chat  
    })
});