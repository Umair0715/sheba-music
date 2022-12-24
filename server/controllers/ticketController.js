const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Ticket = require('../models/ticketModel');
const { sendSuccessResponse , uploadImage } = require('../utils/helpers');

exports.createTicket = catchAsync( async(req , res , next) => {
    const { eventName , singerName , ticketsAvailable , dateAndTime , location , image , eventCategory } = req.body;
    if(!eventName || !singerName || !ticketsAvailable || !dateAndTime || ! location || !image || !eventCategory){
        return next(new AppError('Missing required credentials.' , 400))
    }
    let _image = uploadImage(image , 'ticketImages')
    let newTicket = await Ticket.create({ 
        eventName , 
        location , 
        singerName , 
        ticketsAvailable ,
        eventCategory , 
        image : _image ,
        dateAndTime , 
        variants : req.body.variants || [] ,
        description : req.body.description || '' ,
        ticketCreator : req.user._id , 
    });
    newTicket = await Ticket.findById(newTicket._id)
    .populate('ticketCreator' , 'name email phone')
    .populate('eventCategory' , 'name')

    return sendSuccessResponse(res , 201 , {
        message : 'New ticket created.', 
        ticket : newTicket
    })
});

exports.updateTicket = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError('Please provide ticket id to update' , 400))
    }
    const updatedTicket = await Ticket.findByIdAndUpdate(id , req.body , {
        new : true , 
        runValidators : true
    })
    .populate('ticketCreator' , 'name email phone')
    .populate('eventCategory' , 'name');
    return sendSuccessResponse(res , 200 , {
        message :'Ticket updated.' , 
        ticket : updatedTicket
    })
});

exports.deleteTicket = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    if(!id){
        return next(new AppError('Please provide ticket id.' , 400))
    }
    await Ticket.findByIdAndUpdate(id , { isActive : false });
    return sendSuccessResponse(res , 200 , {
        message :'Ticket deleted.' 
    })
});

exports.getTickets = catchAsync( async(req , res , next) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const tickets = await Ticket.find({ isActive : true }).limit(pageSize).skip(pageSize * (page - 1 ))
    .populate('ticketCreator' , 'name email phone')
    .populate('eventCategory' , 'name');
    return sendSuccessResponse(res , 200 , {
        tickets 
    })
});

exports.getMyTickets = catchAsync( async(req , res , next) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const tickets = await Ticket.find({ isActive : true , ticketCreator : req.user._id })
    .limit(pageSize).skip(pageSize * (page - 1))
    .populate('ticketCreator' , 'name email phone')
    .populate('eventCategory' , 'name');
    
    return sendSuccessResponse(res , 200 , {
        tickets 
    })
});


exports.getSingleTicket = catchAsync( async(req , res , next) => {
    const { id } = req.params;
    const ticket = await Ticket.findOne({ _id : id , isActive : true })
    .populate('ticketCreator' , 'name email phone')
    .populate('eventCategory' , 'name');
    
    return sendSuccessResponse(res , 200 , {
        ticket
    })
});