const mysql = require('mysql');
const config = require('../../config/config.js');

//local mysql db connection
const connection = mysql.createConnection(config.mysql['default']);

connection.connect(function(err) {
    if (err) throw err;
    else console.log('Successfully connected to the mysql');
});

if (config.app.env !== undefined && config.app.env === 'dev') {
  connection.on('enqueue', function(sequence) {
      if ('Query' === sequence.constructor.name) {
        console.log(sequence.sql);
      }
    });
}

module.exports = connection;