const amqpClient = require('amqplib/callback_api');
const config = require('../../config/config.js');

const publisher = () => {
}

publisher.topic = 'Bus'

function start() {
    amqpClient.connect(config.mqtt.default.host + "?heartbeat=60", function(err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        return setTimeout(start, 1000);
      }
      conn.on("error", function(err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      conn.on("close", function() {
        console.error("[AMQP] reconnecting");
        return setTimeout(start, 1000);
      });
  
      console.log("[AMQP] connected");
      amqpConn = conn;
  
      whenConnected();
    });
  }
  
  function whenConnected() {
    startPublisher();
  }
  
  var pubChannel = null;
  var offlinePubQueue = [];
  function startPublisher() {
    amqpConn.createConfirmChannel(function(err, ch) {
      if (closeOnErr(err)) return;
      ch.on("error", function(err) {
        console.error("[AMQP] channel error", err.message);
      });
      ch.on("close", function() {
        console.log("[AMQP] channel closed");
      });
  
      pubChannel = ch;      
      while (true) {
        var m = offlinePubQueue.shift();
        if (!m) break;
        publisher.publish(m[0], m[1], m[2]);
      }
    });
  }
  
  // method to publish a message, will queue messages internally if the connection is down and resend later
  publisher.publish = (routingKey, content) => {
    try {
      pubChannel.assertExchange(publisher.topic, 'fanout', {durable: false}, function(err, ok) {
        if (closeOnErr(err)) return;
        pubChannel.publish(publisher.topic, routingKey, content, { persistent: true },
                          function(err, ok) {
                            if (err) {
                              console.error("[AMQP] publish", err);
                              offlinePubQueue.push([publisher.topic, routingKey, content]);
                              pubChannel.connection.close();
                            }
        });
      });                      
    } catch (e) {
      console.error("[AMQP] publish", e.message);
      offlinePubQueue.push([publisher.topic, routingKey, content]);
    }
  }
  
  function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
  }
  start();
  module.exports = publisher;