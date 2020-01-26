
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
   threshold: {
   },
   mongo: {
    default: process.env.MONGO_CONNECTION_STRING,
   },
   mysql: {
       default: {
           host: process.env.MYSQL_HOST,
           user: process.env.MYSQL_USER,
           password: process.env.MYSQL_PASSWORD,
           database: process.env.MYSQL_DB
       }
   },
   mqtt: {
    default: {
        host: process.env.MQTT_CONNECTION_STRING
    }
},   
   app: {
       port: process.env.APP_PORT,
       env: 'prod',
       httpsOptions: {}
   },
}