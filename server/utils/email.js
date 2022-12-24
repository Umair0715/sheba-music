const nodemailer = require("nodemailer");

exports.sendEmail = async (email , subject , text) => {
   let transporter = nodemailer.createTransport({
      name : process.env.EMAIL_HOST ,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
         user: process.env.EMAIL_USER, 
         pass: process.env.EMAIL_PASSWORD,
      },
   });

   const mailOptions = {
      from:`${process.env.EMAIL_USER}` ,
      to: email,
      subject ,
      text 
   };

  return await transporter.sendMail(mailOptions);
  
};
















// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLEINT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(
//    CLIENT_ID,
//    CLEINT_SECRET,
//    REDIRECT_URI
// );

// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// async function sendEmail(user , text , subject) {
  
//    const accessToken = await oAuth2Client.getAccessToken();

//    const transport = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//          type: 'OAuth2',
//          user: process.env.HOST_EMAIL,
//          clientId: CLIENT_ID,
//          clientSecret: CLEINT_SECRET,
//          refreshToken: REFRESH_TOKEN,
//          accessToken: accessToken,
//       },
//    });

//    const mailOptions = {
//       from: `${process.env.HOST_EMAIL}`,
//       to: user.email,
//       subject ,
//       text ,
//    };

//    return await transport.sendMail(mailOptions);
// }

// async function sendForgotPasswordMail(user , token ) {
  
//    const accessToken = await oAuth2Client.getAccessToken();

//    const transport = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//          type: 'OAuth2',
//          user: process.env.HOST_EMAIL,
//          clientId: CLIENT_ID,
//          clientSecret: CLEINT_SECRET,
//          refreshToken: REFRESH_TOKEN,
//          accessToken: accessToken,
//       },
//    });

//    const mailOptions = {
//       from: `${process.env.HOST_EMAIL}`,
//       to: user.email,
//       subject : "Forgot Password Request" ,
//       text : `Copy this token and paste it in your app to update your password <br /> ${token}`,
//    };

//    return await transport.sendMail(mailOptions);
// }


// module.exports = { sendEmail , sendForgotPasswordMail };