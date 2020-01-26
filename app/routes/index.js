module.exports = (app) => {
    const mqtt = require('../controllers/mqtt.js');
    // Publish the topic
    app.post('/publish', mqtt.publish);

}