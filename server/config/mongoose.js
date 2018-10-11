const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const mongoose = require('mongoose');

module.exports = function(){
  mongoose.connect(config.db, { useNewUrlParser: true });
  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Mongoose connected!');
  });
  
  return db;
};
