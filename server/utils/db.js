const mongoose = require('mongoose');

// const DB = 'mongodb://localhost:27017/shebaMusic';
const DB = process.env.DATABASE_URI;

const connectDB = () => {
   mongoose.connect(DB , {
      useNewUrlParser : true ,
      useUnifiedTopology : true 
   })
   .then(() => console.log('database connected'))
   .catch(err => console.log('database connection failed' , err))
}

module.exports = connectDB ;