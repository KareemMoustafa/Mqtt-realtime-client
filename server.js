const config = require('./config/config.js')
const protocol = config.app.port !== 443 ? require('http') : require('https')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// create express app
const app = express();

app.use (function (req, res, next) {
    next()
});


app.use(cors())
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true, parameterLimit:500000}));

// define a simple route
app.get('/', (req, res) => {
    res.json({'message': 'Kick to mqtt application'});
});

require('./app/routes/index.js')(app);

protocol.createServer({},app).listen(config.app.port,function () {
    console.log('Server is listening on port: '+ config.app.port);

})