const jwt = require('jsonwebtoken');

exports.signToken = ( payload , expiredTime ) => {
   return jwt.sign(payload , process.env.JWT_SECRET , {
      expiresIn : expiredTime 
   })
}