const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendSuccessResponse } = require('../utils/helpers');
const BuySong = require('../models/buySongModel');
const Wallet = require('../models/walletModel');
const WalletHistory = require('../models/walletHistoryModel');
const Song = require('../models/songModel');
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

exports.buySong = catchAsync( async(req , res , next) => {
    // 1) Validation 
    let { song , amount , buyStatus , paymentMethod , influencer } = req.body;
    const buyer = req.user._id ;
    let songPrice = amount;

    if(!song || !amount || paymentMethod === null){
        return next(new AppError('Missing required credentials.' , 400))
    }
    // 2) check already bought 
    const isBuyed = await BuySong.findOne({ buyer : req.user._id , song , isActive : true , buyStatus : true });
    if(isBuyed){
        return next(new AppError('You have already purchased this Song.' , 400))
    }

    // 3) check buyer should not be song owner
    const songToBuy = await Song.findById(song);
    if(buyer.toString() === songToBuy.songCreator.toString()){
        return next(new AppError('You cannot buy your own songs.' , 400))
    }
    if(songToBuy.license.type === 0 ){
        return next(new AppError('This song is free' , 400))
    }

    // wallets
    const buyerWallet = await Wallet.findOne({ user : buyer , isActive : true  });
    const songOwner = await User.findById(songToBuy.songCreator);
    const songOwnerWallet = await Wallet.findOne({ user : songOwner._id , isActive : true });
    const admin = await User.findOne({ userType : 5 });
    const adminWallet = await Wallet.findOne({ user : admin._id });

    //check payment method 
    if(paymentMethod === 0 ){ //mean user pay with his wallet
        if(buyerWallet.totalBalance < songPrice){
            return next(new AppError('You have insufficient balance to buy this song.' , 400))
        }   

        if(influencer){
            const songOwnerInfluencer = await TagInfluencer.findOne({ user : songOwner._id , influencer , isActive : true });
            if(!songOwnerInfluencer){
                return next(new AppError("This influencer is not found in song owner's influencers list." , 404))
            }

            //detuct song amount from buyer wallet 
            buyerWallet.totalBalance -= songPrice;
            await buyerWallet.save();
            await createWalletHistory(3 , amount , buyer , buyerWallet._id , 'Purchased a Song.');

            const influencerWallet = await Wallet.findOne({ user : influencer , isActive : true });
            
            //Influencer 
            let influencerProfit = (songPrice / 100) * songOwnerInfluencer.profitPercentage;
            songPrice -= influencerProfit;
            let influencerAdminCommission = await AdminCommission.findOne({ commissionType : 4 , isActive : true });
            let adminCommissionFromInfluencer = (influencerProfit / 100) * influencerAdminCommission.commission;
            influencerProfit -= adminCommissionFromInfluencer;

            influencerWallet.totalBalance += influencerProfit;
            await influencerWallet.save();
            await createWalletHistory(2 , influencerProfit , songOwnerInfluencer._id , influencerWallet._id , 'Someone purchased a song.');

            //add influencer commission to admin wallet
            adminWallet.totalBalance += adminCommissionFromInfluencer;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromInfluencer , adminWallet.user , adminWallet._id , 'Commission from influencer.' );

            //detuct admin commission from Song owner
            const adminCommission = await AdminCommission.findOne(
                { commissionType : songOwner.userType , isActive : true }
            );
            const adminCommissionFromSongOwner = (songPrice / 100) * adminCommission.commission;
            songPrice -= adminCommissionFromSongOwner;
            adminWallet.totalBalance += adminCommissionFromSongOwner;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromSongOwner , adminWallet.user , adminWallet._id , 'Commission from Song owner.' );

            // add remaining amount to Song owner wallet 
            songOwnerWallet.totalBalance += songPrice;
            await songOwnerWallet.save();
            await createWalletHistory(2 , songPrice , songOwner._id , songOwnerWallet._id , 'Someone purchase your Song.')
            
            const newPurchasedSong = await BuySong.create({ 
                song , amount , buyer , buyStatus , paymentMethod , influencer ,
                songOwner : songOwner._id
            });

            return sendSuccessResponse(res , 200 , {
                message : 'You have successfully purchased a Song.' , 
                song : newPurchasedSong
            })
        }else {
            //detuct Song amount from buyer wallet 
            buyerWallet.totalBalance -= songPrice;
            await buyerWallet.save();
            await createWalletHistory(3 , amount , buyer , buyerWallet._id , 'Purchased a Song.');

            const adminCommission = await AdminCommission.findOne(
                { commissionType : songOwner.userType , isActive : true }
            );
            const adminCommissionFromSongOwner = (songPrice / 100) * adminCommission.commission;
            songPrice -= adminCommissionFromSongOwner;
            adminWallet.totalBalance += adminCommissionFromSongOwner;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromSongOwner , adminWallet.user , adminWallet._id , 'Commission from Song owner.' );

            // add remaining amount to Song owner wallet 
            songOwnerWallet.totalBalance += songPrice;
            await songOwnerWallet.save();
            await createWalletHistory(2 , songPrice , songOwner._id , songOwnerWallet._id , 'Someone purchase your Song.')
            
            const newPurchasedSong = await BuySong.create({ 
                song , amount , buyer , buyStatus , paymentMethod ,
                songOwner : songOwner._id
            });

            return sendSuccessResponse(res , 200 , {
                message : 'You have successfully purchased a Song.' , 
                song : newPurchasedSong
            })
        }

    }else { // user pay with payment gateway
        if(influencer){
            const songOwnerInfluencer = await TagInfluencer.findOne({ user : songOwner._id , influencer , isActive : true });
            if(!songOwnerInfluencer){
                return next(new AppError("This influencer is not found in song owner's influencers list." , 404))
            }
            const influencerWallet = await Wallet.findOne({ user : songOwnerInfluencer._id , isActive : true });
            
            //Influencer 
            let influencerProfit = (songPrice / 100) * songOwnerInfluencer.profitPercentage;
            songPrice -= influencerProfit;
            let influencerAdminCommission = await AdminCommission.findOne({ commissionType : 4 , isActive : true });
            let adminCommissionFromInfluencer = (influencerProfit / 100) * influencerAdminCommission.commission;
            influencerProfit -= adminCommissionFromInfluencer;

            influencerWallet.totalBalance += influencerProfit;
            await influencerWallet.save();
            await createWalletHistory(2 , influencerProfit , songOwnerInfluencer._id , influencerWallet._id , 'Someone purchased a song.');

            //add influencer commission to admin wallet
            adminWallet.totalBalance += adminCommissionFromInfluencer;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromInfluencer , adminWallet.user , adminWallet._id , 'Commission from influencer.' );

            //detuct admin commission from Song owner
            const adminCommission = await AdminCommission.findOne(
                { commissionType : songOwner.userType , isActive : true }
            );
            const adminCommissionFromSongOwner = (songPrice / 100) * adminCommission.commission;
            songPrice -= adminCommissionFromSongOwner;
            adminWallet.totalBalance += adminCommissionFromSongOwner;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromSongOwner , adminWallet.user , adminWallet._id , 'Commission from Song owner.' );

            // add remaining amount to Song owner wallet 
            songOwnerWallet.totalBalance += songPrice;
            await songOwnerWallet.save();
            await createWalletHistory(2 , songPrice , songOwner._id , songOwnerWallet._id , 'Someone purchase your Song.')
            
            const newPurchasedSong = await BuySong.create({ 
                song , amount , buyer , buyStatus , paymentMethod , influencer ,
                songOwner : songOwner._id
            });

            return sendSuccessResponse(res , 200 , {
                message : 'You have successfully purchased a Song.' , 
                song : newPurchasedSong
            })
        }else {
            const adminCommission = await AdminCommission.findOne(
                { commissionType : songOwner.userType , isActive : true }
            );
            const adminCommissionFromSongOwner = (songPrice / 100) * adminCommission.commission;
            songPrice -= adminCommissionFromSongOwner;
            adminWallet.totalBalance += adminCommissionFromSongOwner;
            await adminWallet.save();
            await createWalletHistory(2 , adminCommissionFromSongOwner , adminWallet.user , adminWallet._id , 'Commission from Song owner.' );

            // add remaining amount to Song owner wallet 
            songOwnerWallet.totalBalance += songPrice;
            await songOwnerWallet.save();
            await createWalletHistory(2 , songPrice , songOwner._id , songOwnerWallet._id , 'Someone purchase your Song.')
            
            const newPurchasedSong = await BuySong.create({ 
                song , amount , buyer , buyStatus , paymentMethod , songOwner : songOwner._id
            });

            return sendSuccessResponse(res , 200 , {
                message : 'You have successfully purchased a Song.' , 
                song : newPurchasedSong
            })
        }

    }
});


exports.getMyBuySongs = catchAsync( async(req , res , next) => {
    const songs = await BuySong.find({ 
        buyer : req.user._id , 
        isActive : true
    })
    .populate('buyer' , 'name email phone')
    .populate('song' , 'title audio songCover license')
    .populate('songOwner' , 'name email phone');
    
    return sendSuccessResponse(res , 200 , {
        songs 
    })
});


