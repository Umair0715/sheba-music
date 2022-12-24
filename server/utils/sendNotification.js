var FCM = require('fcm-node');
var serverKey = process.env.FIREBASE_SERVER_KEY;	
var fcm = new FCM(serverKey);


const sendNotification = async (user , title , body , data) => {
    var message = { 
        to: user.fcmToken , 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title , 
            body   
        },
        data 
    };
    fcm.send(message, function(err, resp){
        if (err) {
            return err;
        } 
    });
}

module.exports = sendNotification;