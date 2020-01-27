const publisher = require('../libraries/publisher');

exports.publish = (req, res) => {
  publisher.publish(req.body.topic, "location", new Buffer(JSON.stringify(req.body)));
  webPush(req, res)
  return res.send({
      success: true
  })
};

function webPush(req, res) {
  const userModel = require('../models/userModel.js')
  let param = {SchoolID: req.body.SchoolID}
  userModel.list(param, res, async (users) => {
    if (users) {
      users.forEach(user => {
        let topic = 'WEB-USER-' + user.UserPID
        publisher.publish(topic, "location", new Buffer(JSON.stringify(req.body)));
      });
    }
  });
}


