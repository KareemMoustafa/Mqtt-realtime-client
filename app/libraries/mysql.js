const mysql = require('mysql');
const config = require('../../config/config.js');

//local mysql db connection
const connection = mysql.createConnection(config.mysql['default']);

connection.connect(function(err) {
    if (err) {
      console.error("[MYSQL]",err)
      throw err;
    }
    else console.log("[MYSQL] connected");
});

connection.on('error', function(err) {
  console.error("[MYSQL]",err)
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    connection.connect(function(err) {
      if (err) {
        console.error("[MYSQL]",err)
        throw err;
      }
      else console.log("[MYSQL] reconnected");
    });
  } else {
    console.error("[MYSQL]",err)
    throw err;
  }
});

if (config.app.env !== undefined && config.app.env === 'dev') {
  connection.on('enqueue', function(sequence) {
      if ('Query' === sequence.constructor.name) {
        console.info("[MYSQL]", sequence.sql);
      }
    });
}

module.exports = connection;