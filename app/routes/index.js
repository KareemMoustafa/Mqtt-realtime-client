module.exports = (app) => {
    const client = require('../controllers/client.js');
    // Publish the topic
    app.post('/publish', client.publish);

}