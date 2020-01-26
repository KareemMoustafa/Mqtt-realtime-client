const publisher = require('../libraries/publisher');


exports.publish = (req, res) => {
  publisher.topic = req.body.topic
  publisher.publish(publisher.topic, "location", new Buffer(JSON.stringify(req.body)));
  return res.send({
      success: true
  })
};


