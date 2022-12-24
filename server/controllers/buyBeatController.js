const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const BuyBeat = require('../models/buyBeatModel');
const Wallet = require('../models/walletModel');
const WalletHistory = require('../models/walletHistoryModel');
const Beat = require('../models/beatModel');
const User = require('../models/userModel');
const TagInfluencer = require('../models/tagInfluencerModel');
const AdminCommission = require('../models/commissionModel');

const createWalletHistory = async (type , amount , user , wallet , description) => {
    await WalletHistory.create({ 
        type , 
        amount ,
        user ,
        wallet , 
        description 
    })
}

exports.buyBeat = catchAsync( async(req , res , next) => {
    // 1) Validation 
    let { beat , amount , buyStatus , paymentMethod , influencer } = req.body;
    const buyer = req.user._id ;
    let beatPrice = amount;

    if(!beat || !amount || paymentMethod === null){
        return next(new AppError('Missing required credentials.' , 400))
    }
    // 2) check already bought 
    const isBuyed = await BuyBeat.findOne({ buyer : req.user._id , beat , isActive : true , buyStatus : true });
    if(isBuyed){
        return next(new AppError('You have already purchased this Beat.' , 400))
    }

    // 3) check buyer should not be beat owner
    const beatToBuy = await Beat.findById(beat);
    if(buyer.toString() === beatToBuy.beatCreator.toString()){
        return next(new AppError('You cannot buy your own Beat.' , 400))
    }
    if(beatToBuy.license.type === 0 ){
        return next(new AppError('This beat is free' , 400))
    }

    // wallets
    const buyerWallet = await Wallet.findOne({ user : buyer , isActive : true  });
    const beatOwner = await User.findById(beatToBuy.beatCreator);
    const beatOwnerWallet = await Wallet.findOne({ user : beatOwner._id , isActive : true });
    const admin = await User.findOne({ userType : 5 });
    const adminWallet = await Wallet.findOne({ user : admin._id });

    //check payment method 
    if(paymentMethod === 0 ){ //mean user pay with his wallet
        if(buyerWallet.totalBalance < beatPrice){
            return next(new AppError('You have insufficient balance to buy this beat.' , 400))
        }   

        if(influencer){
            const beatOwnerInfluencer = await TagInfluencer.findOne({ user : beatOwner._id , influencer , isActive : true });
            if(!beatOwnerInfluencer){
                return next(new AppError("This influencer is not found in beat owner's influencers list." , 404))
            }

            //detuct beat amount from buyer wallet 
            buyerWallet.totalBalance -= beatPrice;
            await buyerWallet.save();
            await createWalletHistory(3 , amount , buyer , buyerWallet._id , 'Purchased a Beat.');

            const influencerWallet = await Wallet.findOne({ user : influencer , isActive : true });
            
            //Influencer 
            let influencerProfit = (beatPrice / 100) * beatOwnerInfluencer.profitPercentage;
            beatPrice -= influencerProfit;
            let influencerAdminCommission = await AdminCommission.findOne({ commissionType : 4 , isActive : true });
            let adminCommissionFromInfluencer = (influencerProfit / 100) * influencerAdminCommission.commission;
            influencerProfit -= adminCommissionFromInfluencer;

            influencerWallet.totalBalance += influencerProfit;
            await influencerWallet.save();
            await createWalletHistory(2 , influencerProfit , beatOwnerInfluencer._id , influencerWallet._id , 'Someone purchased a beat.');

            //add influencer commission to admin wallet
            adminWallet.totalBalance += adminCommissionFromInfluencer;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromInfluencer , adminWallet.user , adminWallet._id , 'Commission from influencer.' );

            //detuct admin commission from beat owner
            const adminCommission = await AdminCommission.findOne(
                { commissionType : beatOwner.userType , isActive : true }
            );
            const adminCommissionFromBeatOwner = (beatPrice / 100) * adminCommission.commission;
            beatPrice -= adminCommissionFromBeatOwner;
            adminWallet.totalBalance += adminCommissionFromBeatOwner;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromBeatOwner , adminWallet.user , adminWallet._id , 'Commission from beat owner.' );

            // add remaining amount to beat owner wallet 
            beatOwnerWallet.totalBalance += beatPrice;
            await beatOwnerWallet.save();
            await createWalletHistory(2 , beatPrice , beatOwner._id , beatOwnerWallet._id , 'Someone purchase your Song.')
            
            const newPurchasedBeat = await BuyBeat.create({ 
                beat , amount , buyer , buyStatus , paymentMethod , influencer ,
                beatOwner : beatOwner._id
            });

            return sendSuccessResponse(res , 200 , {
                message : 'You have successfully purchased a beat.' , 
                beat : newPurchasedBeat
            })
        }else {
            //detuct Song amount from buyer wallet 
            buyerWallet.totalBalance -= beatPrice;
            await buyerWallet.save();
            await createWalletHistory(3 , amount , buyer , buyerWallet._id ,        'Purchased a beat.');

            const adminCommission = await AdminCommission.findOne(
                { commissionType : beatOwner.userType , isActive : true }
            );
            const adminCommissionFromBeatOwner = (beatPrice / 100) * adminCommission.commission;
            beatPrice -= adminCommissionFromBeatOwner;
            adminWallet.totalBalance += adminCommissionFromBeatOwner;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromBeatOwner , adminWallet.user , adminWallet._id , 'Commission from beat owner.' );

            // add remaining amount to beat owner wallet 
            beatOwnerWallet.totalBalance += beatPrice;
            await beatOwnerWallet.save();
            await createWalletHistory(2 , beatPrice , beatOwner._id , beatOwnerWallet._id , 'Someone purchase your Song.')
            
            const newPurchasedBeat = await BuyBeat.create({ 
                beat , amount , buyer , buyStatus , paymentMethod ,
                beatOwner : beatOwner._id
            });

            return sendSuccessResponse(res , 200 , {
                message : 'You have successfully purchased a beat.' , 
                beat : newPurchasedBeat
            })
        }

    }else { // user pay with payment gateway
        if(influencer){
            const beatOwnerInfluencer = await TagInfluencer.findOne({ user : beatOwner._id , influencer , isActive : true });
            if(!beatOwnerInfluencer){
                return next(new AppError("This influencer is not found in beat owner's influencers list." , 404))
            }

            const influencerWallet = await Wallet.findOne({ user : influencer , isActive : true });
            
            //Influencer 
            let influencerProfit = (beatPrice / 100) * beatOwnerInfluencer.profitPercentage;
            beatPrice -= influencerProfit;
            let influencerAdminCommission = await AdminCommission.findOne({ commissionType : 4 , isActive : true });
            let adminCommissionFromInfluencer = (influencerProfit / 100) * influencerAdminCommission.commission;
            influencerProfit -= adminCommissionFromInfluencer;

            influencerWallet.totalBalance += influencerProfit;
            await influencerWallet.save();
            await createWalletHistory(2 , influencerProfit , beatOwnerInfluencer._id , influencerWallet._id , 'Someone purchased a beat.');

            //add influencer commission to admin wallet
            adminWallet.totalBalance += adminCommissionFromInfluencer;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromInfluencer , adminWallet.user , adminWallet._id , 'Commission from influencer.' );

            //detuct admin commission from beat owner
            const adminCommission = await AdminCommission.findOne(
                { commissionType : beatOwner.userType , isActive : true }
            );
            const adminCommissionFromBeatOwner = (beatPrice / 100) * adminCommission.commission;
            beatPrice -= adminCommissionFromBeatOwner;
            adminWallet.totalBalance += adminCommissionFromBeatOwner;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromBeatOwner , adminWallet.user , adminWallet._id , 'Commission from beat owner.' );

            // add remaining amount to beat owner wallet 
            beatOwnerWallet.totalBalance += beatPrice;
            await beatOwnerWallet.save();
            await createWalletHistory(2 , beatPrice , beatOwner._id , beatOwnerWallet._id , 'Someone purchase your Song.')
            
            const newPurchasedBeat = await BuyBeat.create({ 
                beat , amount , buyer , buyStatus , paymentMethod , influencer ,
                beatOwner : beatOwner._id
            });

            return sendSuccessResponse(res , 200 , {
                message : 'You have successfully purchased a beat.' , 
                beat : newPurchasedBeat
            })
        }else {
            const adminCommission = await AdminCommission.findOne(
                { commissionType : beatOwner.userType , isActive : true }
            );
            const adminCommissionFromBeatOwner = (beatPrice / 100) * adminCommission.commission;
            beatPrice -= adminCommissionFromBeatOwner;
            adminWallet.totalBalance += adminCommissionFromBeatOwner;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromBeatOwner , adminWallet.user , adminWallet._id , 'Commission from beat owner.' );

            // add remaining amount to beat owner wallet 
            beatOwnerWallet.totalBalance += beatPrice;
            await beatOwnerWallet.save();
            await createWalletHistory(2 , beatPrice , beatOwner._id , beatOwnerWallet._id , 'Someone purchase your Song.')
            
            const newPurchasedBeat = await BuyBeat.create({ 
                beat , amount , buyer , buyStatus , paymentMethod  ,
                beatOwner : beatOwner._id
            });

            return sendSuccessResponse(res , 200 , {
                message : 'You have successfully purchased a beat.' , 
                beat : newPurchasedBeat
            })
        }

    }
});


exports.getMyBuyBeats = catchAsync( async(req , res , next) => {
    const beats = await BuyBeat.find({ 
        buyer : req.user._id , 
        isActive : true
    })
    .populate('buyer' , 'name email phone')
    .populate('beat' , 'title audio beatCover license')
    .populate('beatOwner' , 'name email phone');
    
    return sendSuccessResponse(res , 200 , {
        beats 
    })
});
  
